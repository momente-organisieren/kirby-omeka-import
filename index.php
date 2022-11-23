<?php

use Kirby\Cms\File;
use Kirby\Cms\Page;
use Kirby\Exception\NotFoundException;
use Kirby\Filesystem\F;


Kirby::plugin( 'momente-organisieren/kirby-omeka-import', [
	'blueprints' => [
		'blocks/omeka_object'      => __DIR__ . '/blueprints/blocks/omeka_object.yml',
		'files/omeka_object_image' => __DIR__ . '/blueprints/files/omeka_object_image.yml'
	],
	'hooks'      => [
		// https://getkirby.com/docs/reference/plugins/hooks/page-update-before
		'page.update:after' => function ( Kirby\Cms\Page $newPage, Kirby\Cms\Page $oldPage ) {
			if ( "story" === $newPage->intendedTemplate()->name() ) {
				$contentElements               = json_decode( $newPage->content->get( 'main_content_blocks' ) );
				$pageHasOmekaObjects           = false;
				$contentBlocksWithOmekaObjects = [];
				if ( ! empty( $contentElements ) ) {
					foreach ( $contentElements as $content ) {
						$omekaBlocks = get_omeka_objects_from_layout_field_content( $content );
						if ( ! empty( $omekaBlocks ) ) {
							$pageHasOmekaObjects = true;
							foreach ( $omekaBlocks as $block ) {
								$blockId                                   = $block->id;
								$existing_or_new_file                      = download_image_for_kirby( $block, $newPage );
								$contentBlocksWithOmekaObjects[ $blockId ] = $existing_or_new_file;
							}
						}
					}
				} # end-foreach
				if ( $pageHasOmekaObjects ) {
					$newContent = add_images_to_omeka_blocks_in_page_content( $contentElements, $contentBlocksWithOmekaObjects );
					$savedPage  = $newPage->update(
						[ 'main_content_blocks' => json_encode( $newContent ) ]
					);
				}
			}
		}
	]
] );

/**
 * @param array $contentElements
 * @param array $contentBlocksWithOmekaObjects
 *
 * @return array
 */
function add_images_to_omeka_blocks_in_page_content( array $contentElements, array $contentBlocksWithOmekaObjects ): array {
	// contentElements = main_content_blocks
	foreach ( $contentElements as $contentElementKey => $contentElement ) {
		// if we are using grid-layout plugin
		if ( property_exists( $contentElement, 'grid' ) ) {
			if ( $contentElement->type === "grid" ) {
				$gridContent = json_decode( $contentElement->content->grid );
				// INSIDE GRID
				foreach ( $gridContent as $gridContentColumnKey => $gridContentColumn ) {
					// INSIDE GRID COLUMNS
					foreach ( $gridContentColumn as $gridColumnsKey => $gridColumn ) {
						// VALIDATE
						if ( ! empty( $gridColumn ) && is_array( $gridColumn ) ) {
							foreach ( $gridColumn as $gridColumnKey => $gridColumContents ) {
								// VALIDATE
								if ( ! empty( $gridColumContents->blocks ) ) {
									// INSIDE BLOCK
									foreach ( $gridColumContents->blocks as $blockKey => $block ) {
										// IF THE ARRAY WITH OMEKA BLOCK IDS CONTAINS A KEY THAT MATCHES THE CURRENT BLOCK ID
										if ( isset( $contentBlocksWithOmekaObjects[ $block->id ] ) ) {
											// KIRBY IMAGE OBJECT WAS SAVED IN THIS ARRAY
											$existing_or_new_file = $contentBlocksWithOmekaObjects[ $block->id ];
											// REASSEMBLE THE GRID CONTENT OBJECT AND FILL IN THE IMAGE DATA
											$gridContent[ $gridContentColumnKey ]->$gridColumnsKey[ $gridColumnKey ]->blocks[ $blockKey ]->content->images = [ $existing_or_new_file->id() ];
										}
									}
								}
							}
						}
					}
				}
				$contentElements[ $contentElementKey ]->content->grid = json_encode( $gridContent );
			}
		} else {
			foreach ( $contentElements as $contentKey => $content ) {
				foreach ( $content->columns as $columnKey => $column ) {
					$blocks = $column->blocks;
					if ( ! empty( $blocks ) ) {
						foreach ( $blocks as $blockKey => $block ) {
							if ( isset( $contentBlocksWithOmekaObjects[ $block->id ] ) ) {
								$existing_or_new_file = $contentBlocksWithOmekaObjects[ $block->id ];

								$contentElements[ $contentKey ]->columns[ $columnKey ]->blocks[ $blockKey ]->content->images = [ $existing_or_new_file->id() ];
							}
						}
					}
				}
			}
		}
	}

	return $contentElements;

}

/**
 * @param $block
 * @param Page $page
 *
 * @return bool|File
 * @throws NotFoundException
 */
function download_image_for_kirby( $block, Page $page ) {
	// blueprint comes with the plugin
	$omeka_object_image_blueprint = Kirby\Cms\Blueprint::find( 'files/omeka_object_image' );
	$remote_image_title           = $block->content->object_title;
	$remote_image_target_filename = \Kirby\Toolkit\Str::slug( $remote_image_title );
	$slugObjectId                 = \Kirby\Toolkit\Str::slug( $block->content->object_id );
	$proposed_filename            = $remote_image_target_filename . '-pwd-' . $slugObjectId . '.jpg';
	$omeka_file_exists            = omeka_file_exists( $page, $proposed_filename );
	if ( ! $omeka_file_exists ) {
		$remote_image_url = $block->content->object_thumb_large;
		$fileProps        = [
			"blueprint" => $omeka_object_image_blueprint,
			'source'    => store_in_tmp_filesystem( $remote_image_url, $remote_image_target_filename ),
			'filename'  => $proposed_filename,
			'parent'    => $page,
			'content'   => [
				'archive_ref' => $block->content->object_id,
				'alt'         => prepare_alt_text( $block )
			]
		];

		return $page->createFile( $fileProps );
	} else {
		return $omeka_file_exists;
	}
}

/**
 * @param Page $page
 * @param $filename
 *
 * @return false|mixed
 */
function omeka_file_exists( Page $page, $filename ) {
	$needle = $page->root() . '/' . $filename;
	foreach ( $page->files() as $currentFile ) {
		if ( $currentFile->root() === $needle ) {
			return $currentFile;
		}
	}

	return false;
}

/**
 * @param $block
 *
 * @return string
 */
function prepare_alt_text( $block ): string {
	$title     = $block->content->object_title;
	$type      = $block->content->object_type;
	$date      = $block->content->object_date;
	$medium    = $block->content->object_medium;
	$format    = $block->content->object_format;
	$copyright = $block->content->object_rights;
	$creator    = $block->content->object_creator;

	return $title . ', ' . $type . ', ' . $date . ', ' . $medium . ', ' . $format . ' cm, ' . $copyright . ' ' . $creator;

}

/**
 * @param $content
 *
 * @return array
 */
function get_omeka_objects_from_layout_field_content( $content ): array {
	$omekaBlocks = [];
	foreach ( $content->columns as $column ) {
		$blocks = $column->blocks;
		if ( ! empty( $blocks ) ) {
			foreach ( $blocks as $block ) {
				if ( 'omeka_object' === $block->type ) {
					$omekaBlocks[] = $block;
				}
			}
		}
	}

	return $omekaBlocks;

}

/**
 * Walk through stored content elements and return
 * blocks that contain omeka_object, if any
 *
 * @param $gridContent
 *
 * @return array
 */
function get_omeka_objects_from_grid_layout_content( $gridContent ): array {
	$omekaBlocks = [];
	$gridContent = json_decode( $gridContent );
	if ( $gridContent ) {
		foreach ( $gridContent as $gridColumns ) {
			foreach ( $gridColumns as $gridColumn ) {
				if ( ! empty( $gridColumn ) && is_array( $gridColumn ) ) {
					foreach ( $gridColumn as $gridColumContents ) {
						$blocks = $gridColumContents->blocks;
						if ( ! empty( $blocks ) ) {
							foreach ( $blocks as $block ) {
								if ( 'omeka_object' === $block->type ) {
									$omekaBlocks[] = $block;
								}
							}
						}
					}
				}
			}
		}
	}

	return $omekaBlocks;
}

/**
 * Retrieve a file for given URL with php curl,
 * write to /tmp directory and return its path
 *
 * @see https://www.geeksforgeeks.org/download-file-from-url-using-php/
 *
 * @param $url
 * @param $filename
 *
 * @return string
 */
function store_in_tmp_filesystem( $url, $filename ): string {
	$ch        = curl_init();
	$temp_name = tempnam( "/tmp", $filename );
	$handle    = fopen( $temp_name . '.jpg', "w" );
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_FILE, $handle );
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
	curl_exec( $ch );
	curl_close( $ch );
	unlink( $temp_name );
	fclose( $handle );

	return $temp_name . '.jpg';
}
