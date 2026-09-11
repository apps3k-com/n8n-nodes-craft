# 07 · Workflow examples

Read a document list: connect Manual Trigger to Craft Documents, select Document → List, configure credentials and execute. Inspect the returned IDs before adding dependent operations.

Read tasks: with a compatible Space connection and node v2, choose Task → Get and Inbox. To read tasks in a particular document, choose Document scope and select that document.

Update a collection row: select the collection, use Item Selection → Select Item in v2 or map an existing row ID, then supply only the fields you want to change.

Upload a file: connect a node producing binary data to File → Upload. Match Input Binary Field to that binary property and choose the intended page/date or sibling block.

Update an existing task: retain the task ID returned by an earlier step and pass it to Update. Use Add only when a new task is intended. Repeating Add can create another task.

Use a dedicated test document for write examples. Read changes back before extending the workflow to additional items. Start with a single input item, then expand the input once the result is correct.
