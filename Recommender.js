const { parentPort } = require('worker_threads');
const { stopwords } = require('stopword');

class Recommender {
    constructor() {
        this.rawdata = [];
        this.data = []
        this.tfid_dict = {};
        this.vectorize_dict = [];
        this.count_dict = {}
    }


    start(rawdata) {
        this.rawdata = rawdata;
        this.fix();
        this.CountVectorizer();
        this.tfid_fit_transform();
    }
    fix() {
        this.rawdata.forEach((item)=> {
            let words = item.Description;
            const wordsArray = words.toLowerCase().split(/\s+/)
            let obj = item;
            obj['Description'] = wordsArray;
            this.data.push(obj)
        })
    }
    CountVectorizer() {
        this.data.forEach((item) => {
            let words = item.Description;
             words.forEach((word) => {
                 if (this.count_dict.hasOwnProperty(word)) {
                     this.count_dict[word]+=1;
                 } else {
                     this.count_dict[word] = 1;
                 }
                 this.total_num += 1;
             });
        });
    }
    tfid_vectorize() {
        this.data.forEach((item) => {
            let words = item.Description;
            const tfid_vector = {};
            words.forEach((word) => {
                if (this.tfid_dict.hasOwnProperty(word)) {
                    if (!tfid_vector.hasOwnProperty(word)) {
                        tfid_vector[word] = 0;
                    }
                    tfid_vector[word] += this.tfid_dict[word];
                }
            });
            this.vectorize_dict.push(tfid_vector);
        });
    }

    cosine_simularity(search_term, matrix) {
        // use keys to access matrix elements and perform dot product operations
        const dotProduct = Object.keys(search_term).reduce((sum, key) => {
            if (matrix.hasOwnProperty(key)) {
                return sum + (search_term[key] * matrix[key]);
            }
            return sum;
        }, 0);
        
        const m1 = Math.sqrt(Object.values(search_term).reduce((sum, val) => sum + (val * val), 0));
        const m2 = Math.sqrt(Object.values(matrix).reduce((sum, val) => sum + (val * val), 0));

        if (m1 === 0 || m2 === 0) return 0; // prevent div by 0

        return dotProduct / (m1 * m2);
        
    }

    filterAndSort(vector, max_r, weight=0.0) {
        let results = [];
        let ret = [];
        this.vectorize_dict.forEach((doc_vector, index) => {
            const score = this.cosine_simularity(vector, doc_vector);
            results.push({ index: index, score: score });
        });
        results.sort((a, b) => b.score - a.score);

        for (let i =0;i < max_r && i<results.length; i++) {
            if (results[i].score >= weight) {
                let index = results[i].index;
                ret.push(this.data[index]);
            } 
        }
        return ret;
    }

    recommend(term) {

        const search_vector = this.tfid_transform(term);
        const ret = this.filterAndSort(search_vector,100,0.0);
        let combinedRet = ret;
        
        let message = "";
        
        return {ret:combinedRet, message:message};
    }


    tfid_fit_transform() {
        Object.keys(this.count_dict).forEach((word) => {
            this.tfid_dict[word] = Math.log((this.total_num+1)/(this.count_dict[word]+1)) + 1;
        });
        this.tfid_vectorize();


    }

    tfid_transform(term) {
        const tokens = term.toLowerCase().split(/\s+/);
        const term_tfid = {};

        tokens.forEach((word) => {
            if (this.tfid_dict.hasOwnProperty(word)) {
                if (!term_tfid.hasOwnProperty(word)) {
                    term_tfid[word] = this.tfid_dict[word];
                } else {
                    term_tfid[word] += this.tfid_dict[word];
                }
                
            } else {
                term_tfid[word] = 0;
            }
        });

        return term_tfid;
    }

}

const Engine = new Recommender();

parentPort.on('message', (msg) => {
    if (msg.type == "start") {
        const { data } = msg.task;
        console.log(data);
        Engine.start(data);
        parentPort.postMessage({ type: 'loaded' });
    } else if (msg.type == "query") {
        const { rec } = msg.task;
        console.log(rec);
        const results = Engine.recommend(rec.result.response);
        parentPort.postMessage({ type: 'recommendResult', results });
    }
});