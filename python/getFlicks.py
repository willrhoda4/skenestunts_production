 

 

import re
import time
import json
import sys

from bs4                               import BeautifulSoup       as bs
from selenium                          import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by      import By
from selenium.webdriver.support.ui     import WebDriverWait
from selenium.common.exceptions        import WebDriverException
from selenium.webdriver.support        import expected_conditions as EC

service_object = Service('/Applications/chromedriver')
chrome_options = webdriver.ChromeOptions()

chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-blink-features=AutomationControlled')
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)

driver = webdriver.Chrome(service=service_object, options=chrome_options)
wait   = WebDriverWait(driver,10)

driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36'})
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")




def getFlicks(team = sys.argv[1:]):
    
    def click_div (id):
        
        time.sleep(2)
        
        div = wait.until(EC.element_to_be_clickable((By.ID, id )))
        
        try:                       div.click()
        except WebDriverException: click_div(id)

        time.sleep(1)


    all_films = []
    totals    = []
    crew      = team #['nm1451329', 'nm1819605', 'nm0804055']

    #    print('Received This: ', sys.argv[1:])


    for double in range(len(crew)):
        
        driver.get('https://www.imdb.com/name/' + crew[double] + '/fullcredits')
        #click_div("iconContext-expand-more")
        
        soup       = bs(driver.page_source)
        divs       = soup.body.findAll('div')
        stunt_divs = re.findall('id="stunts-tt\w+', str(divs))
        film_ids   = {film[11:] for film in stunt_divs}
        
        all_films += film_ids
        totals.append(len(film_ids))


    total_credits = len(all_films)
    all_films     = list(set(all_films))


    return print(json.dumps([total_credits, len(all_films), all_films]))
#    return print(json.dumps([totals]))



getFlicks()



