# 03 · Tasks

Craft Daily Notes keeps its existing Get, Add, Update and Delete task operations. Craft Documents v2 exposes them under All Documents (Space) → Task.

Get: choose Active, Upcoming, Inbox, Logbook or Document. Document scope in the Space node requires a document selected by name or ID. Update/Delete use a scoped task picker or direct task ID.

Add: enter task content and choose Inbox, Daily Note with date, or Document as the location in the Space node. Each incoming n8n item creates one task.

Update: select the task and supply changed content, state (To Do, Done, Canceled), schedule, deadline or location. Empty optional fields leave existing values unchanged; they are not a way to clear dates. The API value for Canceled is canceled, with one l.

Delete removes the selected task. Use isolated, explicitly designated test content for write checks. Read the task back after changes and retain returned IDs for later updates.

Example: Manual Trigger → Craft Documents (Space, Task, Get, Inbox) reads the inbox. For a write test, create a uniquely named task in a dedicated test document, retain its ID, update it to Done and read that document scope back. Do not treat a fixture run as proof of live writes.

For a safe first test, read a scope you can access. Only create or change tasks in a document intended for testing. Empty results do not verify how populated task lists will behave.
