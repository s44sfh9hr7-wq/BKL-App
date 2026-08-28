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
