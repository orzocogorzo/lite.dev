function BaseWagon (initState) {
    this.name = "base-wagon";
    this.url = "init.json";
    this.preload = true;
    this.initState = initState || new Object();
    this.onUpdate = this.onUpdate.bind(this);
    this.onFeeds = this.onFeeds.bind(this);
}

BaseWagon.prototype.feed = function feed () {
    // TO OVERWRITE
    return this.$fetch(this.url).then(this.onFeeds);
}

BaseWagon.prototype.onFeeds = function onFeeds (res) {
    // TO OVERWRITE
    return new Promise((resolve, reject) => {
        res.json().then(data => {
            console.log("fetched:"+this.name, data);
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

BaseWagon.prototype.onUpdate = function onUpdate (change) {
    // TO OVERWRITE
    console.log("update:"+this.name, change);
}

module.exports = BaseWagon;