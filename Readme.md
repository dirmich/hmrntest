0. project 전체에서 패키지이름 변경 -> find all and replace com.<AppName> -> com.highmaru.<AppName>

[android 초기설정]
app>build.gradle>android.defaultConfig에 추가
multiDexEnabled true

[register codepush]
code-push register
code-push login
code-push app add <AppName> <ios/android> react-native
키확인 : code-push deployment ls <AppName> -k

[2.use appcenter]
appcenter apps create -d <project> -o Android -p React-Native
appcenter apps create -d <project> -o iOS -p React-Native
키확인 : appcenter codepush deployment list -a <AppName> -k

1. ios/ info.plist에 추가
   <key>CodePushDeploymentKey</key>
   <string>{key}</string>
2. android/app/src/main/res/values/strings에 추가
   <string moduleConfig="true" name="CodePushDeploymentKey">{key}</string>

[FCM 사용]
App.js/useFirebase = true

1. https://console.firebase.google.com
2. project 생성
3. ios/android app 생성
4. googleservice-info 다운로드

[Location 사용]
AppRoot.js/useLocation = true

[AppIcon]
https://appicon.co/

[Splash Screen]
https://blog.logrocket.com/building-a-splash-screen-in-react-native/
yarn add react-native-splash-screen

[FingerPrint on emulator]
1.Activate Screenlock from Settings -> Security

2. add new fingerprint

3. adb -e emu finger touch 1155aa1155

[kakao login]

1. app등록 : https://developers.kakao.com/
2. yarn add @react-native-seoul/kakao-login
3. ios/<app>/Info.plist에 추가

<key>CFBundleURLTypes</key>
<array>
<dict>
<key>CFBundleTypeRole</key>
<string>Editor</string>
<key>CFBundleURLSchemes</key>
<array>
<string>kakao{카카오 네이티브앱 아이디를 적어주세요}</string>
</array>
</dict>
</array>
<key>KAKAO_APP_KEY</key>
<string>{카카오 네이티브앱 아이디를 적어주세요}</string>
<key>LSApplicationQueriesSchemes</key>
<array>
<string>kakaokompassauth</string>
<string>storykompassauth</string>
<string>kakaolink</string>
</array>

4.  android

    - AndroidManifest.xml 수정
      application->android:allowBackup='true'
    - AndroidManifest.xml에 추가
      <activity android:name="com.kakao.sdk.auth.AuthCodeHandlerActivity">
      <intent-filter>
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />

            <!-- Redirect URI: "kakao{NATIVE_APP_KEY}://oauth“ -->
            <data android:host="oauth"
                android:scheme="kakao{카카오 네이티브 앱 key를 입력해주세요}" />

        </intent-filter>
      </activity>

    - app/src/main/res/values/strings.xml에 추가
      <string name="kakao_app_key">your_app_key</string>
    - android/build.gradle에 추가
      buildscript.ext : kotlinVersion = '1.3.41'
      buildscript.dependencies : classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"

    * build.gradle(Project) -> allprojects에 maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/' } 추가

[naver login]

1. yarn add @react-native-seoul/naver-login

[Reactnative에서 node.crypto사용]

1. yarn add react-native-crypto react-native-randombytes
2. yarn add -D rn-nodeify
3. package.json > script에 추가
   "nodeify": "rn-nodeify --hack --install process,crypto,events,constant,console,stream,url,util",
   "postinstall": "yarn nodeify",

import '<ProjectRoot>/shim.js'
import crypto from 'crypto'

[WebRTC사용]
yarn add react-native-webrtc

1. android
   build.gradle에서 minSDK = 24이상해야한다.

[Using Template]

reactnative 0.68이상 사용시 jdk11 설치 필요

# update latest version in package.json

yarn upgrade-interactive --latest

# uninstall legacy cli

npm uninstall -g react-native-cli

# install new cli

npm i -g @react-native-community/cli

# or

yarn global add @react-native-community/cli

react-native init <AppName></AppName> --template https://github.com/dirmich/hm-rn-base.git
