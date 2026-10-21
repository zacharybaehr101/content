#!/usr/bin/env python3
"""Push CampusVox sheet data (Home + Admissions tabs) to Google Sheets.

Reads the export workbook committed at data/campusvox-sheet-import.xlsx and
writes both tabs, replacing existing content. Run via the push-sheet-data
GitHub Actions workflow; credentials come from repository secrets
(GOOGLE_SHEET_ID, GOOGLE_SHEETS_KEY). The key is never printed or logged.
"""
import json
import os
import sys

TABS = ["Home", "Admissions"]


def main():
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    import openpyxl

    spreadsheet_id = os.environ["GOOGLE_SHEET_ID"]
    key_info = json.loads(os.environ["GOOGLE_SHEETS_KEY"])
    xlsx_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..", "..", "data", "campusvox-sheet-import.xlsx",
    )

    creds = Credentials.from_service_account_info(
        key_info, scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
    values = build("sheets", "v4", credentials=creds).spreadsheets().values()

    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    for tab in TABS:
        ws = wb[tab]
        rows = [
            [str(c) if c is not None else "" for c in r]
            for r in ws.iter_rows(values_only=True)
        ]
        while rows and not any(c.strip() for c in rows[-1]):
            rows.pop()
        print(f"{tab}: clearing and writing {len(rows)} rows x {len(rows[0])} cols",
              flush=True)
        values.clear(spreadsheetId=spreadsheet_id, range=tab).execute()
        values.update(
            spreadsheetId=spreadsheet_id,
            range=f"{tab}!A1",
            valueInputOption="RAW",
            body={"values": rows},
        ).execute()
    print("done", flush=True)


if __name__ == "__main__":
    missing = [v for v in ("GOOGLE_SHEET_ID", "GOOGLE_SHEETS_KEY")
               if not os.environ.get(v)]
    if missing:
        sys.exit(f"missing env vars: {', '.join(missing)}")
    main()
