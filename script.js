const { createApp } = Vue

createApp({
  data() {
    return {
      artist1: './img/1.jpg',
      artist2: './img/2.jpg',
      artist_search: '', 
      search_text: '',
      results: [], 
      sorted: [],
      sortType: "Reset to original",
      genres: [],
      filtered: [],
      genreFilter: [],
      resultCount: 0, 
      collectionSort: false, 
      priceSort: false, 
      originalSort: true, 
      resultsFound: true,
      originalResults: [],
      copiedResults: []

    }
  },
  methods: {
    search: function(){
      this.resultsFound = false;
      this.artist_search = this.search_text;
      this.genreFilter = []
      this.genres = []
      const querySearch = 'https://itunes.apple.com/search?attribute=allArtistTerm&term=' + encodeURI(this.artist_search) + "&origin=*"
      axios
        .get(querySearch)
        .then(response => {
          this.resultsFound = true;
          this.originalResults = response.data.results;
          this.results = response.data.results;
          this.resultCount = this.results.length;
          if(this.resultCount < 1){
            alert("No artist was found.")
          }
          for (let i = 0; i < this.resultCount; i++) {
            if (this.results[i].artistName === '') {
              this.results[i].artistName = 'No information provided';
            }
            if (this.results[i].collectionName === '') {
              this.results[i].collectionName = 'No information provided';
            }
            if (this.results[i].kind === '') {
              this.results[i].kind = 'No information provided';
            }
            if (this.results[i].previewUrl === '') {
              this.results[i].previewUrl = 'No information provided';
            }
            if (this.results[i].trackId === '') {
              this.results[i].trackId = 'No information provided';
            }
            if (this.results[i].country === '') {
              this.results[i].country = 'No information provided';
            }
            if (this.results[i].trackPrice === undefined | this.results[i].trackPrice < 0) {
              this.results[i].trackPrice = 0;
            }

            if(this.genres.includes(this.results[i].primaryGenreName) == false){
              this.genres.push(this.results[i].primaryGenreName);
            }
          }
          this.filtered = this.results;
          for(let b = 0; b < this.filtered.length; ++b){
            this.copiedResults.push(this.filtered[b])
          }
      });
    },

    filter: function(genreType){
  
      this.filtered = []

      if(genreType === 'All' & this.genreFilter.includes('All') == false){
        let only_all = [];
        this.genreFilter = [...only_all];
        this.genreFilter.push('All');
        this.resultCount = this.results.length;
        this.filtered = []
        for(let b = 0; b < this.results.length; ++b){
          this.filtered.push(this.results[b])
        }
      }
      else {
        if(!this.genreFilter.includes(genreType)){
          this.genreFilter.push(genreType);

          if(this.genreFilter.includes('All')) {
            let num = this.genreFilter.indexOf('All');
            this.genreFilter.splice(num, 1);
          }
        }
        else if(this.genreFilter.includes(genreType)){
          let index = this.genreFilter.indexOf(genreType);
          this.genreFilter.splice(index, 1);
        }

        this.resultCount = 0;
        this.filtered = [];
        for(let b = 0; b < this.results.length; ++b){
          if(this.genreFilter.includes(this.results[b].primaryGenreName)){
            this.filtered.push(this.results[b])
            this.resultCount += 1;
          }
        }
      }
      this.copiedResults = []
      for(let b = 0; b < this.filtered.length; ++b){
        this.copiedResults.push(this.filtered[b])
      }


    },

    sort: function(sortType){
      //filtered will have the correct data to sort always 
      //cannot revert to og because filtered is always changing 

      this.sortType = sortType; 
      if(this.sortType === "Reset to original") {
        this.originalSort = true;
        this.priceSort = false;
        this.collectionSort = false;
        this.filtered = []
        for(let b = 0; b < this.copiedResults.length; ++b){
          this.filtered.push(this.copiedResults[b])
        }
      }

      else if(this.sortType === "Price") {
        this.originalSort = false;
        this.priceSort = true;
        this.collectionSort = false;
        this.filtered.sort((a, b) => (a.trackPrice > b.trackPrice) ? 1 : -1)
      }

      else if(this.sortType === "Collection Name") {
        this.originalSort = false;
        this.priceSort = false;
        this.collectionSort = true;
        this.filtered.sort((a, b) => (a.collectionName > b.collectionName) ? 1 : -1)
      }
    }

  }
}).mount('#app')
