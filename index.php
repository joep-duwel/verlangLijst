
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mijn verlang lijstje</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
    <div class="tit"><h1>Mijn verlang lijstje</h1></div>

    </header>
<main>
    <div class="container">
        <div class="cards">
            <a href="https://www.bol.com/nl/nl/p/lego-marvel-war-machine-mechapantser-76277/9300000157956403/?Referrer=ADVNLGOO002027-S--9300000157956403&gad_source=1&gclid=Cj0KCQiA88a5BhDPARIsAFj595hTL1d1oh62osFgv3KrP8bh2gy5jiQ8DKvHMfTwBAX1joQGMm4qVqwaArecEALw_wcB" style="text-decoration: none;">
                <img class="img" src="img/warmachien.jpg">
                <div class="name"><h3 id="productName">LEGO Marvel War Machine mechapantser - 76277</h3></div>
                <div class="where">
                    <h4>Waar kan het vinden</h4>
                    <p>bol.com <br></p>
                </div>
            </a>
            <button class="copy-name" onclick="copyProductName()">Kopieer de naam van het product</button>
        </div>
    </div>

    <script>
        function copyProductName() {
            // Selecteer de naam van het product
            const productName = document.getElementById("productName").innerText;

            // Kopieer de tekst naar het klembord
            navigator.clipboard.writeText(productName).then(() => {
                alert("Productnaam gekopieerd naar klembord!");
            }).catch(err => {
                console.error("Fout bij kopiëren: ", err);
            });
        }
    </script>



</main>
</body>
</html>