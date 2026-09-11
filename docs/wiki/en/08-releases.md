# 08 · Versions and updates

[Open the public changelog](craftdocs://open?blockId=3E5464FC-C3C6-4387-ADFB-DE3D5CAFC8C7&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6) for published release notes and changes under development.

Unreleased identifies work that is not yet confirmed as a published package version. Check the version available in the npm registry and the version installed in n8n before relying on a new feature.

Package versions and node versions are different. Updating the package can add node v2 while saved workflows continue to use node v1.

Before updating a package, back up your workflows and review the release notes. Test existing workflows and new functionality in an appropriate test environment.

Version-1 workflows keep their existing parameter layout and string IDs. Version-2 selectors support named choices and direct IDs; verify the selected resources when configuring a new node.

The German and English handbooks cover the same user-facing topics. Use the language link on the handbook home page to switch editions. These handbooks do not contain deployment instructions for any particular organization.
