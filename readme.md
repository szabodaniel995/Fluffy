A feladat:

1: tetszőleges nyelven írj egy programot, ami egy lottósorsolást szimulál, hasonló nagyságrendű feladott szelvénnyel. A sorsolásnál öt szám legyen kihúzva véletlenszerűen.
2: állapítsd meg, a szelvények között hány öt, négy, három és két találatos van. Számold ki, melyik találat egyenként mennyi pénzt nyert. A teljes nyereményalap legyen felhasználva. Minden találat között ugyanakkora összeg legyen szétosztva, vagyis a nyereményalap negyede menjen az öt találatosnak, a negyede a négyeseknek és így tovább.
3: optimalizáld (vagy írd át) a programod úgy, hogy az eredményt egy átlagos számítógépen vagy laptopon 5 másodpercen belül visszaadja.

A feladat megoldása Node -al történt, a választott adattárolási mód: JSON file a merevlemezen.
Saját laptopomon a program a feladatot 5 másodpercen belül megoldja (i7 4710hq processzor, Samsung 860 EVO 500Gb SSD), a kért adatokat konzolban a futási idővel együtt kilistázza
A konzolba kiírás az egyes találatokhoz tartozó nyereményt kerekítve listázza, emiatt kézzel utóellenőrizve eltérés lehet az össznyeremény, és az egyes nyeremények összeadott összege között

Instrukciók a kipróbáláshoz:

1. Fájlok letöltése / repo klónozása
2. Git bash indítása, ebbe a munkakönyvtárba navigálás
3. "node databaseCreator.js" paranccsal az adatbázis létrehozása
4. "node index.js" paranccsal a nyerőszámok kisorsolása, az adatbázis betöltése, az adatműveletek elvégzése, az eredmények konzolba írása
