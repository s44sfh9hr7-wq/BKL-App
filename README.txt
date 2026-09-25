BKL APP V0.9.1 – ECHTE SUPABASE AUTH
Demo-Rollenumschalter entfernt. Registrierung, E-Mail-Bestätigung, Login/Logout und eigenes Profil an Supabase angebunden. Master-#1-Initialisierung folgt separat und wird nicht clientseitig vergeben.

BKL APP V0.9.0.1 – SICHTBARER SUPABASE-VERBINDUNGSTEST
Testet read-only die Tabelle public.events und zeigt das Ergebnis direkt in der App.
Keine Daten werden verändert.

BKL APP V0.9.0 – ERSTE SUPABASE-ANBINDUNG
Basis: korrigierte V0.8.8.2.
In supabase-config.js ausschließlich Project URL und öffentlichen anon-Key eintragen. Keine Secrets.
Bestehende lokale Funktionen bleiben für diesen ersten Verbindungstest erhalten.

BKL APP PROTOTYP V0.8.8.2

BKL APP PROTOTYP V0.8.8.1

BKL APP PROTOTYP V0.8.8

BKL APP PROTOTYP V0.8.7

BKL APP PROTOTYP V0.8.6

BKL APP PROTOTYP V0.8.5

BKL APP PROTOTYP V0.8.4

BKL APP PROTOTYP V0.8.3

BKL APP PROTOTYP V0.8.2

BKL APP PROTOTYP V0.8.1

BKL APP PROTOTYP V0.8.0

BKL-App – Startseiten-Prototyp V0.1

INHALT
- index.html         Startseite
- styles.css         BKL-Design (Schwarz / Weiß / Orange)
- app.js             Countdown, Menü, Platzhalter-Dialoge
- manifest.webmanifest
- service-worker.js  PWA-Basis
- assets/            Banner und Logo

TESTEN
1. Schnelltest am Computer:
   index.html im Browser öffnen.
   Der Countdown und die Navigation funktionieren bereits.

2. PWA / Smartphone-Test:
   Wegen Browser-Sicherheitsregeln sollte die App über einen kleinen Webserver
   statt direkt per file:// geöffnet werden.

   Beispiel mit Python:
   - Terminal / Eingabeaufforderung im Ordner öffnen
   - python -m http.server 8080
   - Browser: http://localhost:8080

HINWEISE
- Der Veranstaltungstermin ist aktuell auf den 30.05.2027, 14:00 Uhr gesetzt.
- Die Unterseiten sind bewusst noch Platzhalter.
- Später werden Datum, Banner, Sponsoren, News usw. aus dem Adminbereich geladen.
- Das Banner und andere Medien sind nicht fest im Layout "eingebrannt", sondern als
  separate Dateien eingebunden und damit später leicht austauschbar.


V0.3 – Korrektur / Erweiterung
- Die Startseite basiert wieder vollständig auf V0.1.
- Layout, Proportionen, Navigation und bestehende Hover-Effekte wurden beibehalten.
- Hover-up-Effekte für Desktop wurden zusätzlich leicht verstärkt.
- Seite 2 „Veranstaltungen“ wurde im exakt gleichen Designsystem ergänzt.
- Die große Karte „BKL 2027“ ist vollständig anklickbar und führt aktuell auf den Platzhalter für WF-03.


V0.4 – WF-03 Veranstaltungsdetailseite
- Aufbauend auf V0.3, ohne bestehende Seiten neu zu gestalten.
- Klick auf „BKL 2027“ / „Veranstaltung ansehen“ öffnet nun eine echte Detailseite.
- Start & Ziel: Leggewies, Polch.
- Kein Galerie-/Rückblickbereich auf der Detailseite.
- Eckdaten: Datum, Startzeit, Start/Ziel, Strecke, Startgeld, Teamgröße, Anmeldeschluss, Teamlimit.
- Kompakte Beschreibung, Standortvorschau, Streckenvorschau, Regel-Kurzfassung, Anmeldestatus, Sponsoren.
- Zweiter Anmeldebutton am Seitenende.
- Bilder und Inhalte sind im Prototyp noch statisch, später administrativ pflegbar.


V0.5 – WF-04 / WF-05 / WF-06
- Aufbauend auf V0.4; bestehende Seiten bleiben unverändert.
- Mein Konto, Teilnahme und Mein Team ergänzt.
- Demo-Login zum Testen des angemeldeten Zustands.
- Team gründen, per Code beitreten, Team suchen.
- Team-Code, Beitrittsanfrage, Sichtbarkeit und Startbereitschaft als Prototyp.

V0.6
- Aufbauend auf V0.5; bestehende freigegebene Seiten nicht neu gestaltet.
- Logikfehler im Teilnahmehinweis korrigiert.
- Kontoerstellung mit Vorname, Nachname, Alias, E-Mail, Geburtsdatum, Passwort.
- Demo-Altersprüfung am Veranstaltungstag; Mindestalter in dieser Demo 18 Jahre, später administrativ je Event.
- Unter Mindestalter: Zuschauer-Konto möglich, Teilnahme-/Teamfunktionen gesperrt.
- Persönliche Teilnehmeranmeldung mit erforderlichen Bestätigungen.
- Separate freiwillige Foto-/Videoeinwilligung plus Hinweis zu Übersichts-/Veranstaltungsaufnahmen.
- Admin-Demo für Zahlungseingang, manuelle Teamfreigabe, Startberechtigung, E-Mail-Bestätigung und Änderungsprotokoll.
- E-Mail-Versand und Datenhaltung sind weiterhin Prototyp-Platzhalter; echtes Backend folgt später.


V0.6.1 – Navigationskorrektur
- Keine neue Funktionsstufe; Fehlerkorrektur zu V0.6.
- Konto erstellen ist jetzt direkt über „Mein Konto“ erreichbar.
- Nach der Demo-Kontoerstellung wird der Nutzer sichtbar in den angemeldeten Kontozustand geführt.
- Altersprüfung wirkt sichtbar auf „Am BKL teilnehmen“ und „Mein Team“.
- „Jetzt anmelden“ führt ohne Konto zuerst zu „Mein Konto“; mit berechtigtem Konto direkt zur Teilnahmeauswahl.
- Teilnahme -> Team gründen / beitreten / suchen -> persönliche Teilnehmeranmeldung ist durchklickbar.
- Admin-Demo „Teamfreigabe“ ist im Hauptmenü sichtbar gekennzeichnet.
- Bestehende freigegebene Seiten aus V0.6 wurden nicht neu gestaltet.

V0.6.2
- Neues quadratisches BKL-App-Icon ergänzt.
- Apple-Touch-Icon für „Zum Home-Bildschirm“ auf iPhone/iPad eingebunden.
- PWA-Icons in 192x192 und 512x512 im Webmanifest hinterlegt.
- Service-Worker-Cache auf V0.6.2 aktualisiert.
- Bestehende Funktionen und Designs von V0.6.1 bleiben unverändert.

V0.7
- BKL-Hymne startet bei Anmelden/Jetzt anmelden und läuft beim internen Navigieren weiter.
- Play/Pause-Button ergänzt.
- Galerie: neuester BKL zuerst, neueste freigegebene Bilder zuerst.
- Foto-Upload für Kontonutzer als Demo; Veröffentlichung erst nach Orga-Freigabe.
- Orga-Ansicht mit Freigeben/Ablehnen.
- Video-Link-Vorschau je BKL.


V0.7.1 HOTFIX
- BKL-Hymne zusätzlich im App-Hauptverzeichnis.
- Audioquelle auf ./bkl-hymne.mp3 geändert.
- Service-Worker-Cache auf bkl-prototype-v071 angehoben.


V0.8.0: Rollenmodell, Orga/Master-Testrollen, Admin-Einstieg im Konto, einheitliches Admin-Dashboard, Master-only Systembereich und Sperre der regulären Teilnahme für Orga/Master. Basis bleibt V0.7.1; Galerie und Hymne bleiben erhalten.

V0.8.1: Erstes vollständiges Admin-Fachmodul 'Veranstaltung': Eventtyp, Status, Stammdaten, Anmeldung, Teamlimit, Altersgrenze, Startgeld, Zahlungsarten, PayPal, Beschreibung, lokale Speicherung und Master-only Neuanlage/Löschung.

V0.8.2: Teams-&-Teilnehmer-Adminmodul mit Suche/Filter, Teamstatus, Teilnehmerdetails, Kapitän, Bestätigungsstatus, internen Orga-Notizen und administrativem Teilnehmerersatz. Lokale Prototyp-Speicherung.

V0.8.3: Zahlung & Teilnahmefreigabe: Bar/PayPal, Ist-/Sollbetrag, getrennte Zahlungs- und Teilnahmebestätigung, Voraussetzungskontrolle und simuliertes E-Mail-Protokoll.

V0.8.4: Regelwerk & Strafenkatalog. Master kann Regeln versionieren und Strafenkatalog bearbeiten; Orga/Master können Katalog- und individuelle Strafen anwenden. Änderungsmodus Information/erneute Zustimmung und lokales Strafenprotokoll.

V0.8.5: QR & Checkpoints mit Checkpoint-Verwaltung, Reihenfolge, zufälligen Tokens, Neugenerierung, Ziel-QR und Druckansicht.

V0.8.6: Bonusstationen plus dauerhafter BKL-App-Werbe-QR.

V0.8.7: Rennleitstand, gemeinsamer Startzeitpunkt, laufende Rennuhr, Teamstatus, Zielscan-Simulation mit unveränderlicher Erstzeit, Zielprüfung, manuelle Zielzeit mit Begründung, BKL-Abschluss und Strafzeit-Summenansicht.

V0.8.8: Live-Kartenbasis mit BKL-Streckenkarte; Checkpoints per Fingertipp setzen, auswählen, benennen, verschieben, löschen und mit QR-Checkpoints verknüpfen.

V0.8.8.1: Automatischer Sprung zum geöffneten Admin-Arbeitsbereich.

V0.8.8.2: Öffentlicher Bereich Aktueller BKL: Start/Ziel öffnet Google-Maps-Navigation zu Leggewies, Polch. Strecke zeigt die vorhandene BKL-Karte als Bild, vergrößerbar, mit Strecke 5 Kilometer und Start/Ziel Leggewies, Polch.


V0.9.2: Master-#1-Initialisierung über Supabase Edge Function 'smooth-action'; Adminrolle aus admin_memberships; Login-Text bereinigt.

V0.9.2.1: Master-Rollenfix über public.is_master(); sichtbare Versionsnummer aktualisiert.

V0.9.2.2: Master-Statusfix; robuste Auswertung von is_master().

V0.9.2.3 DIAGNOSE: Temporäre sichtbare Master/RPC-Diagnose im Konto-Bereich. Keine Datenbankänderungen.

V0.9.3: Diagnose entfernt; Master-Erkennung beibehalten; Passwort anzeigen/ausblenden bei Login und Registrierung.


V0.9.4: Fest verdrahteten BKL 2027 aus aktueller Veranstaltung entfernt. Leerzustand ohne Veranstaltung, dynamische Admin-Veranstaltungsdaten, Testveranstaltung nur für Orga/Master, Start/Ziel-Navigation, robusterer Service-Worker-Updatepfad.


BKL APP V0.9.5
- gemeinsame Veranstaltungsdaten über Supabase (Browser/PWA/andere Geräte)
- Testveranstaltungen bleiben durch RLS normalen Nutzern verborgen
- globale Rollenanzeige ORGA-TEAM / MASTER-ADMIN
- echte QR-Codes für App, Checkpoints, Bonus und Ziel (Token-URL)
- zentrale QR-Token-Zuordnung in Supabase
- Kartenvorschau für Start/Ziel + externe Navigation
- neue öffentliche Streckenkarte (vom Nutzer bereitgestelltes Bild)
- vorhandene assets/bkl-live-karte.jpg bleibt technische Live-Karte
- öffentliche Strecke und Live-Karte bewusst getrennt
- Service-Worker Cache auf V0.9.5 angehoben

WICHTIG:
Vor dem ersten Test der gemeinsamen Veranstaltung/QR-Tokens einmal supabase-v095.sql
vollständig im Supabase SQL Editor ausführen.
supabase-config.js NICHT mit einer Vorlage überschreiben.


V0.9.5.1 HOTFIX
- X der vergrößerten Streckenkarte schließt wieder zuverlässig.
- Veranstaltungs-Speichern nutzt jetzt tatsächlich Supabase statt altem localStorage-Handler.
- vorhandener lokaler Test-BKL wird beim ersten Admin-Start einmalig nach Supabase übernommen, falls dort noch keine Veranstaltung existiert.
- ohne angelegten/sichtbaren BKL wird die öffentliche Streckenkarte nicht angezeigt.


BKL APP V0.9.5.2
- QR-Ausgabe auf QRCodeJS umgestellt (Canvas/IMG, Mobile-Safari-kompatibel)
- fehlerhafte qrcode@1.5.4 Browser-Einbindung entfernt
- QR-Fehler werden sichtbar gemeldet statt als leere weiße Fläche
- Service-Worker Cache V0.9.5.2
- keine Datenbankänderung / kein neues SQL
