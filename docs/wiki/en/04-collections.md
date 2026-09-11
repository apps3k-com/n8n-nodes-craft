# 04 · Collections

Collections are structured tables within Craft documents. Select a collection to load its schema. Add Items and Update Items expose supported typed fields rather than requiring a hand-written JSON body.

Supported mapping includes text, numbers, dates and select fields. Current select schemas with string options and legacy singleSelect object options are recognized. The available columns and options come from the live schema.

Relations: choose a relation field and select target rows. Labels use the target collection’s title field. A connection must be able to read the related collection to populate these choices.

Update Items in v2 offers Item Selection → Select Item for a named row. Map Item ID remains the default for existing automations and expressions. Keep IDs from earlier steps when building repeatable updates.

If schema or authentication fails, the picker reports the error. Do not interpret that error as an empty collection. Check the credential, connection scope and collection ID. Re-select the collection after changing credentials or schema.
