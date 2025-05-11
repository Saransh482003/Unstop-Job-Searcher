from time import sleep
import requests
import pandas as pd


class UnstopJobSearcher(Exception):
    def __init__(self, headers):
        """
            A class to search and retrieve jobs/internships listings based on title and location.
            Args:
                headers (dict): A dictionary containing headers to be used for the API requests. Essential headers: 'authorization' and 'user-agent'.
            
            Attributes:
                headers (dict): Stores the headers for API requests.
        """
        self.HEADERS = headers

    def search_jobs(self, title, location, type="jobs"):
        """
            A class to search and retrieve jobs/internships listings based on title and location.
            Args:
                title (str): The name of the jobs/internships to search.
                location (str): The location of the jobs/internships.
                type (str): 'jobs' or 'internships'.
        """
        if type.lower() not in ["jobs","internships"]:
            raise ValueError("Type must be either 'jobs' or 'internships'")
        data = []
        page=1
        while True:
            respo = requests.get(f"https://unstop.com/api/public/opportunity/search-result?opportunity={type}&page={page}&per_page=25&searchTerm={'%20'.join(title.split(' '))}&oppstatus=recent&location={location}&quickApply=true", headers=self.HEADERS)
            if respo.status_code == 200:
                respo = respo.json()
                if respo["data"]["data"] == []:
                    break
                for i in range(len(respo["data"]["data"])):
                    try:
                        fetch = {
                            "title": respo["data"]["data"][i]["title"],
                            "company": respo["data"]["data"][i]["organisation"]["name"],
                            "job_url": "https://unstop.com/"+respo["data"]["data"][i]["public_url"].replace("\\",''),
                            "company_url": "https://unstop.com/"+respo["data"]["data"][i]["organisation"]["public_url"].replace("\\",''),
                            "max_salary": respo["data"]["data"][i]["jobDetail"]["max_salary"],
                            "currecy": respo["data"]["data"][i]["jobDetail"]["currency"],
                            "start_data": respo["data"]["data"][i]["start_date"],
                            "end_date": respo["data"]["data"][i]["end_date"],
                            "views": respo["data"]["data"][i]["viewsCount"],
                            "registered": respo["data"]["data"][i]["registerCount"],
                        }
                        data.append(fetch)
                    except:
                        continue
                page+=1
        return pd.DataFrame(data)