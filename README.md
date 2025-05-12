# 🥂 CocktailDebucle – Istruzioni di Installazione

## 📥 Clonare il Repository

1. Aprire **Visual Studio**
2. Selezionare **"Clona una repository"**
3. Inserire il seguente URL: 
    ```https://github.com/Adam2475/CoctailDebucle.git```
5. Scegliere una cartella locale di destinazione a piacere.
6. Dopo la clonazione, **chiudere Visual Studio**.

---

## 🔐 Configurazione `appsettings.json`

1. Copiare il file `appsettings.json` (fornito separatamente) nella cartella: ./CoctailDebucle.Server
2. Verificare che il contenuto sia simile al seguente, in particolare queste due righe:

```json
"Key": "YourSuperLongSecretKey@1234567890",
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CocktailDB;Trusted_Connection=True;TrustServerCertificate=True;"
```
![immagine file appsettings](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/appsettings.png)

---

## 🗄️ Configurazione del Database

1. Scaricare e installare SQL Server Management Studio (SSMS) da questo link:
    👉 [Download SSMS](https://learn.microsoft.com/en-us/ssms/download-sql-server-management-studio-ssms)

2. All'avvio, nel campo "Nome server" inserire: ```localhost\SQLEXPRESS```

   ![immagine impostazioni ssms](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/settings_sql.png)

---

## 🔧 Configurazione Visual Studio

1. Cliccare sul file .sln presente nella root del progetto per aprire Visual Studio. ![immagine file in cartella](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/file_sln.png)
2. Dal menu superiore, cliccare sulla freccia accanto al pulsante "Avvia" e selezionare "Configura progetti di avvio...". ![immagine menu' tendina](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/settings_visual_studio1.png)
3. Impostare il progetto backend e frontend come progetti da avviare contemporaneamente. ![immagine impostazione debug](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/settings_visual_studio2.png)
4. Cliccare su "Applica" e poi su "OK".

---

## 💻 Dipendenze Frontend

Aprire un terminale nella root del progetto ed eseguire i seguenti comandi:

```bash
npm install @fortawesome/fontawesome-free
npm install primeng --save
npm install primeicons --save
npm i @ngx-translate/core
npm install flag-icons
```

---

## 💾 Dipendenze Backend

Spostarsi nella cartella backend:

```bash
cd ./CoctailDebucle.Server
```

Eseguire:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 9.0.3
dotnet tool install --global dotnet-ef
```

---

## 🧱 Migrazione Database

⚠️ Assicurarsi che il file appsettings.json sia correttamente configurato prima di eseguire questi comandi.

Da terminale, nella cartella ./CoctailDebucle.Server, eseguire:

```bash
dotnet ef database drop --force   # (Ignorare alla prima installazione)
dotnet ef database update
```

Aprendo SQL Server Management Studio, le tabelle del database dovrebbero essere ora visibili.
![immagine database](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/sql_done.png)

---

## ▶️ Avvio dell’Applicazione

1. Tornare in Visual Studio.

2. Premere "Avvia" (▶) per lanciare sia il frontend che il backend della WebApp.

![avviare progetto](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/settings_visual_studio3.png)

![progetto avviato](https://github.com/SabinoCarlucci/cocktailimages/blob/main/readme_images/finish.png)
