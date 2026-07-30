import csv
import time
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import requests

urls = [
    "https://ipsciences.edu/",
    "https://manhattan.edu/",
    "https://resu.edu/",
    "https://saintjosephabbey.com/",
    "https://stkate.edu/",
    "https://www.acs350.org/",
    "https://www.ai.edu/",
    "https://www.albertus.edu/",
    "https://www.alvernia.edu/",
    "https://www.alverno.edu/",
    "https://www.annamaria.edu/",
    "https://www.anselm.edu/",
    "https://www.aquinas.edu/",
    "https://www.aquinascollege.edu/",
    "https://www.assumption.edu/",
    "https://www.athenaeum.edu/",
    "https://www.augustineinstitute.org/",
    "https://www.avemaria.edu/",
    "https://www.avemarialaw.edu/",
    "https://www.avila.edu/",
    "https://www.barry.edu/",
    "https://www.bc.edu/",
    "https://www.bcs.edu/",
    "https://www.bellarmine.edu/",
    "https://www.belmontabbeycollege.edu/",
    "https://www.ben.edu/",
    "https://www.benedictine.edu/",
    "https://www.brescia.edu/",
    "https://www.briarcliff.edu/",
    "https://www.cabrini.edu/",
    "https://www.caldwell.edu/",
    "https://www.canisius.edu/",
    "https://www.caritaschristi.org/",
    "https://www.carlow.edu/",
    "https://www.carroll.edu/",
    "https://www.cbu.edu/",
    "https://www.ccsj.edu/",
    "https://www.cdu.edu/",
    "https://www.chaminade.edu/",
    "https://www.chc.edu/",
    "https://www.cks.edu/",
    "https://www.clarke.edu/",
    "https://www.cmsv.edu/",
    "https://www.cnr.edu/Home/Home/",
    "https://www.creighton.edu/",
    "https://www.csbsju.edu/",
    "https://www.cse.edu/",
    "https://www.csj.edu/",
    "https://www.csm.edu/",
    "https://www.css.edu/",
    "https://www.ctu.edu/",
    "https://www.cua.edu/",
    "https://www.dc.edu/",
    "https://www.depaul.edu/",
    "https://www.desales.edu/",
    "https://www.dhs.edu/",
    "https://www.dom.edu/",
    "https://www.dominican.edu/",
    "https://www.donnelly.edu/",
    "https://www.dspt.edu/",
    "https://www.duq.edu/",
    "https://www.dwci.edu/",
    "https://www.dyc.edu/",
    "https://www.edgewood.edu/",
    "https://www.elms.edu/",
    "https://www.emmanuel.edu/",
    "https://www.fairfield.edu/",
    "https://www.felician.edu/",
    "https://www.fishermore.edu/",
    "https://www.fontbonne.edu/",
    "https://www.fordham.edu/",
    "https://www.franciscan.edu/",
    "https://www.fst.edu/",
    "https://www.gannon.edu/",
    "https://www.georgetown.edu/",
    "https://www.georgian.edu/",
    "https://www.gmc.edu/",
    "https://www.gonzaga.edu/",
    "https://www.gscollege.edu/",
    "https://www.hcc-nd.edu/",
    "https://www.hilbert.edu/",
    "https://www.holyapostles.edu/",
    "https://www.holycross.edu/",
    "https://www.holyfamily.edu/",
    "https://www.holyname.org/SchoolOfNursing/",
    "https://www.holyspiritcollege.org/",
    "https://www.icseminary.edu/",
    "https://www.immaculata.edu/",
    "https://www.iona.edu/",
    "https://www.jcu.edu/",
    "https://www.jpcatholic.com/",
    "https://www.kings.edu/",
    "https://www.laroche.edu/",
    "https://www.lasalle.edu/",
    "https://www.lemoyne.edu/",
    "https://www.lewisu.edu/",
    "https://www.lmu.edu/",
    "https://www.loras.edu/",
    "https://www.lourdes.edu/",
    "https://www.loyno.edu/",
    "https://www.loyola.edu/",
    "https://www.luc.edu/",
    "https://www.maccsa.org/",
    "https://www.madonna.edu/",
    "https://www.magdalen.edu/",
    "https://www.manor.edu/",
    "https://www.mariacollege.edu/",
    "https://www.marian.edu/",
    "https://www.mariancourt.edu/",
    "https://www.marianuniversity.edu/",
    "https://www.marygrove.edu/",
    "https://www.marylhurst.edu/",
    "https://www.marymount.edu/",
    "https://www.marymountpv.edu/",
    "https://www.marywood.edu/",
    "https://www.mccn.edu/",
    "https://www.mchs.edu/",
    "https://www.mercycollege.edu/",
    "https://www.mercyhurst.edu/",
    "https://www.merrimack.edu/",
    "https://www.misericordia.edu/",
    "https://www.molloy.edu/",
    "https://www.mountangelabbey.org/seminary/",
    "https://www.msj.edu/",
    "https://www.msmary.edu/",
    "https://www.msmc.edu/",
    "https://www.msmc.la.edu/",
    "https://www.mtaloy.edu/",
    "https://www.mtmary.edu/",
    "https://www.mtmc.edu/",
    "https://www.mtmercy.edu/",
    "https://www.mu.edu/",
    "https://www.nd.edu/",
    "https://www.ndm.edu/",
    "https://www.ndnu.edu/",
    "https://www.nds.edu/",
    "https://www.neumann.edu/",
    "https://www.newmanu.edu/",
    "https://www.niagara.edu/",
    "https://www.notredamecollege.edu/",
    "https://www.ohiodominican.edu/",
    "https://www.olhcc.edu/",
    "https://www.ollusa.edu/",
    "https://www.ololcollege.edu/",
    "https://www.ost.edu/",
    "https://www.providence.edu/",
    "https://www.quincy.edu/",
    "https://www.regis.edu/",
    "https://www.regiscollege.edu/",
    "https://www.rivier.edu/",
    "https://www.rockhurst.edu/",
    "https://www.rosemont.edu/",
    "https://www.sacn.edu/",
    "https://www.sacredheart.edu/",
    "https://www.saintjoe.edu/",
    "https://www.saintleo.edu/",
    "https://www.saintmarys.edu/",
    "https://www.saintmeinrad.edu/",
    "https://www.saintvincentseminary.edu/",
    "https://www.salve.edu/",
    "https://www.sandiego.edu/",
    "https://www.sau.edu/",
    "https://www.sbu.edu/",
    "https://www.sccky.edu/",
    "https://www.scs.edu/",
    "https://www.scu.edu/",
    "https://www.scu.edu/jst/",
    "https://www.seattleu.edu/",
    "https://www.secon.edu/",
    "https://www.setonhill.edu/",
    "https://www.sf.edu/",
    "https://www.sfcpa.edu/",
    "https://www.sfmccon.edu/",
    "https://www.shc.edu/",
    "https://www.shst.edu/index.aspx/",
    "https://www.shu.edu/",
    "https://www.siena.edu/",
    "https://www.sienaheights.edu/",
    "https://www.sjcme.edu/",
    "https://www.sjcny.edu/",
    "https://www.sjs.edu/",
    "https://www.sju.edu/",
    "https://www.sl.edu/",
    "https://www.slu.edu/",
    "https://www.smcvt.edu/",
    "https://www.smumn.edu/",
    "https://www.smwc.edu/",
    "https://www.snc.edu/",
    "https://www.spalding.edu/",
    "https://www.spc.edu/pages/1.asp/",
    "https://www.sscms.edu/",
    "https://www.stac.edu/",
    "https://www.stbernards.edu/",
    "https://www.stedwards.edu/",
    "https://www.steson.org/Index.aspx?tabindex=0&tabid=1/",
    "https://www.stfranciscollege.edu/",
    "https://www.stgregorys.edu/",
    "https://www.stjohns.edu/",
    "https://www.stjohnsem.edu/",
    "https://www.stmartin.edu/",
    "https://www.stmary.edu/",
    "https://www.stmarys.edu/",
    "https://www.stmarysem.edu/",
    "https://www.stmarytx.edu-ca.edu/",
    "https://www.stonehill.edu/",
    "https://www.strose.edu/",
    "https://www.stthom.edu/",
    "https://www.stthomas.edu/",
    "https://www.stu.edu/",
    "https://www.stvincent.edu/",
    "https://www.stvincentscollege.edu/",
    "https://www.sxu.edu/",
    "https://www.thomasaquinas.edu/",
    "https://www.thomasmore.edu/",
    "https://www.thomasmorecollege.edu/",
    "https://www.trinitydc.edu/",
    "https://www.trocaire.edu/",
    "https://www.udallas.edu/",
    "https://www.udayton.edu/",
    "https://www.udmercy.edu/",
    "https://www.ugf.edu/",
    "https://www.uiw.edu/",
    "https://www.umary.edu/",
    "https://www.uofs.edu/",
    "https://www.up.edu/",
    "https://www.ursuline.edu/",
    "https://www.usfca.edu/",
    "https://www.usj.edu/",
    "https://www.usml.edu/",
    "https://www.villa.edu/",
    "https://www.villanova.edu/",
    "https://www.viterbo.edu/",
    "https://www.walsh.edu/",
    "https://www.wju.edu/",
    "https://www.wtu.edu/",
    "https://www.wyomingcatholiccollege.com/",
    "https://www.xu.edu/",
    "https://www.xula.edu/",
    "https://www2.cbu.edu/cbu/index.htm/",
]

# Define the target keyword categories and the words to look for in link text/hrefs
categories = {
    "NIL": ["nil", "name-image-likeness", "collective"],
    "Dining": ["dining", "food", "meal plan"],
    "Residence": ["residence", "housing", "dorm", "living"],
    "Research": ["research", "grant"],
    "Travel": ["travel", "abroad"],
    "Alumni": ["alumni", "graduates"],
}

headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,"
        " like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}

results = []
print(f"Starting menu keyword scan across {len(urls)} URLs...")

for url in urls:
    clean_url = url.strip()
    if not clean_url.startswith("http"):
        clean_url = "https://" + clean_url

    # Initialize dictionary to hold found links for each category
    row_data = {"Source_URL": clean_url}
    for cat in categories:
        row_data[cat] = "Not Found"

    try:
        response = requests.get(
            clean_url, headers=headers, timeout=10, allow_redirects=True
        )
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Target nav, header, footer, or fall back to all anchors if needed
            nav_elements = soup.find_all(
                ["nav", "header", "footer", "menu"]
            )
            links = []
            if nav_elements:
                for nav in nav_elements:
                    links.extend(nav.find_all("a", href=True))
            # Fallback to general search if structural tags are thin
            if len(links) < 5:
                links = soup.find_all("a", href=True)

            # Evaluate each link against our categories
            base_domain = urlparse(clean_url).netloc
            for a in links:
                href = a["href"]
                link_text = a.get_text(strip=True).lower()
                full_href = urljoin(clean_url, href).lower()

                for cat, keywords in categories.items():
                    if row_data[cat] == "Not Found":
                        for kw in keywords:
                            # Match if keyword is in the visible anchor text or URL path segment
                            if kw in link_text or kw in full_href:
                                # Ensure it points to the same organization/domain structure (avoid external noise)
                                parsed_link = urlparse(full_href)
                                if (
                                    not parsed_link.netloc
                                    or base_domain in parsed_link.netloc
                                ):
                                    row_data[cat] = urljoin(clean_url, href)
                                    break
    except requests.exceptions.RequestException:
        for cat in categories:
            row_data[cat] = "Connection Error"

    results.append(row_data)
    print(f"Scanned: {clean_url}")
    time.sleep(0.3)

# Export output CSV
output_file = "menu-keyword-scraper/website_menu_keywords.csv"
fieldnames = ["Source_URL"] + list(categories.keys())
with open(
    output_file, mode="w", newline="", encoding="utf-8"
) as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    for row in results:
        writer.writerow(row)

print(f"\nDone! Keyword mapping saved to {output_file}")
