# 🥂 CocktailDebucle – Istruzioni di Installazione

## 📥 Clonare il Repository

1. Aprire **Visual Studio**
2. Selezionare **"Clona una repository"**
3. Inserire il seguente URL: https://github.com/Adam2475/CoctailDebucle.git
4. Scegliere una cartella locale di destinazione a piacere.
5. Dopo la clonazione, **chiudere Visual Studio**.

---

## 🔐 Configurazione `appsettings.json`

1. Copiare il file `appsettings.json` (fornito separatamente) nella cartella: ./CoctailDebucle.Server
2. Verificare che il contenuto sia simile al seguente, in particolare queste due righe:

```json
"Key": "YourSuperLongSecretKey@1234567890",
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CocktailDB;Trusted_Connection=True;TrustServerCertificate=True;"

## 🗄️ Configurazione del Database

1. Scaricare e installare SQL Server Management Studio (SSMS) da questo link:
    👉 Download SSMS

2. All'avvio, nel campo "Nome server" inserire: localhost\SQLEXPRESS












-----------------------------------
- Setup Visual Studio Project:

https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-angular?view=vs-2022#prerequisites

----------------------------------------------------------------

In Visual Studio, launch.json stores the startup settings associated with the Start button in the Debug toolbar. launch.json must be located under the .vscode folder.

----------------------------------------------------------------

Press F5 or select the Start button at the top of the window to start the app.

To choose the default browser modify the 'launch.json' fi

---------------------------------------------------------------

- Install primeng library for frontend:

npm install primeng @primeng/themes

docs:
https://primeng.org/installation
