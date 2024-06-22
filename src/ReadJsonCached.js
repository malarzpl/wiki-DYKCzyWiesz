(async () => {

	/**
	 * Reads wiki-JSON pages.
	 * 
	 * @example
		(async () => {
			const configHelper = new ReadJsonCached();
			const data = await configHelper.getConfig();
			console.log(data);
		})();
	* 
	*/
	class ReadJsonCached {
		
		constructor(titles) {
			this.cachedData = null;
			this.cacheTimestamp = null;

			this.apiUrl = "https://pl.wikipedia.org/w/api.php";
			// mapping: page titles to object keys
			this.titles = {
				"Wikiprojekt:Czy_wiesz/konfiguracja/opcje.json": "options",
				"Wikiprojekt:Czy_wiesz/konfiguracja/akcje.json": "events",
			};
			if (typeof titles === 'object') {
				this.titles = titles;
			}
		}

		/**
		 * Loads pages specified by `this.titles`.
		 * 
		 * @returns Combined JSON.
		 */
		async fetchConfig() {
			const url = this.apiUrl;
			const params = new URLSearchParams({
				action: "query",
				prop: "revisions",
				titles: Object.keys(this.titles).join('|'),
				rvprop: "content",
				format: "json"
			});

			const response = await fetch(`${url}?${params.toString()}`);
			const data = await response.json();

			// Process the fetched data
			const pages = data.query.pages;
			const combinedData = {};

			for (const pageId in pages) {
				if (pages.hasOwnProperty(pageId)) {
					const page = pages[pageId];
					let title = page.title;
					if (title in this.titles) {
						title = this.titles[title];
					} else {
						console.warn('title not found', title);
					}
					let content = page.revisions[0]["*"];
					combinedData[title] = JSON.parse(content);
				}
			}

			// Update cache
			this.cachedData = combinedData;
			this.cacheTimestamp = Date.now();

			return combinedData;
		}

		isCacheValid() {
			if (!this.cachedData || !this.cacheTimestamp) {
				return false;
			}

			const cacheAge = (Date.now() - this.cacheTimestamp) / (1000 * 60 * 60); // convert milliseconds to hours
			return cacheAge < 24;
		}

		async getConfig() {
			if (this.isCacheValid()) {
				return this.cachedData;
			} else {
				return await this.fetchConfig();
			}
		}
	}

	// Example usage:
	const configHelper = new ReadJsonCached();
	const data = await configHelper.getConfig();
	console.log(data);
})();