<a target="_blank" href="https://chrome.google.com/webstore/detail/tabula-new-tab-to-do-list/pnadejonabhdibgdmgfcomljhddlpfcc">![Try it now in Crome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_340x96.png "Click here to install this extension from the Chrome Web Store")</a>


Tabula
=======

A Google Chrome Extension that replaces New Tab with a beautiful TODO list.

I've started this project to learn a bit of frontend programming (javascript, css, angularjs) and because I wanted a nice TODO list manager.
I was inspired by the beautiful design ans simplistic approch of the chrome extension [Momentum](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca). However, I wanted a more complete TODO manager, in particular the ability to log finished TODO items--a sort of personal tracking system.


# Contribute

If you like Tabular and you'd like to improve it, embrace the open source spirit, clone the git repository, change it, tweak it, and make it even more awesome.

See https://developer.chrome.com/extensions/getstarted


# Publish

Instructions on how to prepare and package the extension before submitting it to the  Chrome Web Store.

1. Update version in `manifest.json` file.
2. Update tag: `git tag <new_version>`
3. Update changelog: `github_changelog_generator -u jasantunes -p tabula`
4. Merge code
5. Package extension: `zip -r Tabula.zip * -x screenshots/* -x *.zip -x *~`
6. Upload `Tabula.zip` to Chrome Web Store


# Screenshots

![Screenshot 1](https://raw.github.com/jasantunes/Tabula/master/screenshots/Tabula1.png)

![Screenshot 2](https://raw.github.com/jasantunes/Tabula/master/screenshots/Tabula2.png)

![Screenshot 3](https://raw.github.com/jasantunes/Tabula/master/screenshots/Tabula3.png)


# LICENSE

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

