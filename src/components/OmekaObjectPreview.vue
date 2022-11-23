<template>
	<k-block-figure
		:caption="previewTitle"
		:is-empty="!source"
		empty-icon="image"
		empty-text="No Valid Omeka URL given yet …"
		@open="open"
		@update="update"
	>
		<template v-if="thumbUrl">
			<img
				class="k-block-type-image-auto"
				v-if="thumbUrl"
				:alt="content.object_title"
				:src="thumbUrl"
			/>
			<div v-else>No URL given</div>
		</template>
	</k-block-figure>
</template>

<script>
import isURL from 'validator/lib/isURL'

/**
 * Split String - URI into parts and make them accessible
 *
 * @see https://stackoverflow.com/a/71055323/2107262
 * @param s
 * @returns {{folders: *, origin: *, fileext: *, path: *, protocol: *, password: *, hostname: *, search: *, file: *, filename: *, port: *, host: *, hash: *, username: *}}
 * @constructor
 */
function UriInfo(s) {
	s = s.match(/^(([^/]*?:)\/*((?:([^:]+):([^@]+)@)?([^/:]{2,}|\[[\w:]+])(:\d*)?(?=\/|$))?)?((.*?\/)?(([^/]*?)(\.[^/.]+?)?))(\?.*?)?(#.*)?$/);
	return {
		origin: s[1],
		protocol: s[2],
		host: s[3],
		username: s[4],
		password: s[5],
		hostname: s[6],
		port: s[7],
		path: s[8],
		folders: s[9],
		file: s[10],
		filename: s[11],
		fileext: s[12],
		search: s[13],
		hash: s[14]
	};
}

/**
 *
 * @param s
 */
function buildOmekaApiUriForObjectDataRetrieval(s) {
	if (!isURL(s)) {
		return 'invalid';
	}
	const URI_PARTS = UriInfo(s);
	const OBJECT_PATH = URI_PARTS.path;
	let objId = '';
	if (OBJECT_PATH.includes("obj")) {
		objId = OBJECT_PATH;
		objId = objId.replace("/obj/", "")
	}
	return URI_PARTS.origin + '/api/items?search=' + objId
}


// OmekaObj.title = data[0]["dcterms:title"][0]["@value"];


export default {
	data() {
		return {
			thumbUrl: false,
			downloadUrl: false,
		}
	},
	methods: {
		async loadOmekaData(omekaApiUrl) {
			const RESPONSE = await fetch(omekaApiUrl);
			const OMEKA_JSON_RESPONSE = await RESPONSE.json();
			this.thumbUrl = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["medium"];
			this.downloadUrl = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["large"];
			this.content.object_title = OMEKA_JSON_RESPONSE[0]["dcterms:title"][0]["@value"];
			this.content.object_id = OMEKA_JSON_RESPONSE[0]["dcterms:identifier"][0]["@value"];
			this.content.object_thumb_square = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["medium"];
			this.content.object_thumb_large = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["large"];
			if (undefined !== OMEKA_JSON_RESPONSE[0]["o:resource_template"] && null !== OMEKA_JSON_RESPONSE[0]["o:resource_template"]) {
				let resourceTemplateApiUrl = OMEKA_JSON_RESPONSE[0]["o:resource_template"]["@id"]
				const RESOURCE_TEMPLATE_RESPONSE = await fetch(resourceTemplateApiUrl);
				const RESOURCE_TEMPLATE_RESPONSE_JSON = await RESOURCE_TEMPLATE_RESPONSE.json();
				this.content.object_resource_template = RESOURCE_TEMPLATE_RESPONSE_JSON["o:label"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["dcterms:rights"]) {
				this.content.object_rights = OMEKA_JSON_RESPONSE[0]["dcterms:rights"][0]["o:label"];
				this.content.object_rights_link = OMEKA_JSON_RESPONSE[0]["dcterms:rights"][0]["@id"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["dcterms:description"]) {
				this.content.object_description = OMEKA_JSON_RESPONSE[0]["dcterms:description"][0]["@value"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["dcterms:medium"]) {
				this.content.object_medium = OMEKA_JSON_RESPONSE[0]["dcterms:medium"][0]["@value"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["dcterms:date"]) {
				this.content.object_date = OMEKA_JSON_RESPONSE[0]["dcterms:date"][0]["@value"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["dcterms:type"]) {
				this.content.object_type = OMEKA_JSON_RESPONSE[0]["dcterms:type"][0]["@value"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["dcterms:format"]) {
				this.content.object_format = OMEKA_JSON_RESPONSE[0]["dcterms:format"][0]["@value"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["dcterms:creator"]) {
				this.content.object_creator = OMEKA_JSON_RESPONSE[0]["dcterms:creator"][0]["display_title"];
			}
			if (undefined !== OMEKA_JSON_RESPONSE[0]["bibo:isbn13"]) {
				this.content.object_bibo_isbn13 = OMEKA_JSON_RESPONSE[0]["bibo:isbn13"][0]["@value"];
			}
		},
		upload() {
			let currentPage = this.$store.state.content.current
			currentPage = currentPage.replace("/pages/", "")
			this.$refs.upload.open({
				url: this.$urls.api + "/" + this.$api.pages.url(currentPage, "files")
			});
		}
	},
	computed: {
		previewTitle() {
			return `${this.content.object_title}`
		},
		source() {
			let givenUrl = this.content.url;

			// check for valid URL
			if ((0 !== givenUrl.length) && isURL(givenUrl)) {
				const apiUrl = buildOmekaApiUriForObjectDataRetrieval(givenUrl);
				this.loadOmekaData(apiUrl);

				return buildOmekaApiUriForObjectDataRetrieval(givenUrl);
			}
		},
		/*
		async thumbUrl() {
			let givenUrl = this.content.url;
			if ((0 !== givenUrl.length) && isURL(givenUrl)) {
				const apiUrl = buildOmekaApiUriForObjectDataRetrieval(givenUrl);
				const OmekaObj = await getOmekaApiResponse(apiUrl);
				return OmekaObj.smallThumb;
			}
		}
		*/

	}
};

</script>
<style>
.k-block-type-omeka_object .k-block-figure-container {
	display: block;
	text-align: center;
	line-height: 0;
}

.k-block-type-image-auto {
	max-width: 100%;
	max-height: 30rem;
}
</style>