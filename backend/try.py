from unstopjobsearcher import UnstopJobSearcher

headers = {
    "cookie":'unLang=en; g_state={"i_l":0}; allowedCookie=1; XSRF-TOKEN=vrFYMkJXiQhNtf495XOlOD7PRuSgn0u28JhU1VS1; laravel_session=rTXyRCYfYCGQgAzl3n0BH4vvWaPp5Tkey5NgscJy; country=IN',
    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}

job_searcher = UnstopJobSearcher(headers)
results_df = job_searcher.search_jobs("data science", "bangalore", "internships")
print(results_df)