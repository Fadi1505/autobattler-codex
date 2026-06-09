# Autobattler

## Run Locally

Double-click `run-game.bat`, then open:

```text
http://127.0.0.1:4173
```

You can also run this from a terminal in the project folder:

```powershell
py -m http.server 4173
```

Do not open `index.html` directly if you want the 3D hero models. Browsers block local `.glb` model loading from `file://`, so the game needs to be served from `localhost` or hosted online.

## 3D Models

The current hero models use the KayKit Adventurers character pack, which is CC0. The license file is included in `assets/models/KayKit_Adventurers_CC0_License.txt`.
