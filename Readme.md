# Kirby3 Plugin: kirby-omeka-import

adds a new block type 'Omeka Object' (`omeka_object`) that allows the import of metadata and images from an omeka-s
installation

## example blueprint

```yaml
      main_content_blocks:
        label:
          en: Main content
          de: Hauptinhalt
        type: layout
        layouts:
          - "1/1"
          - "1/2, 1/2"
          - "1/3, 2/3"
          - "2/3, 1/3"
        fieldsets:
          - omeka_object
          - heading
          - image
          - text
          - quote
```

