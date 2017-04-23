class CommentsPoster {
    constructor() {
        this.sendComment = this.sendComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.setSlug = this.setSlug.bind(this);
    }

    setSlug(slug) {
        this.slug = slug;
    }

    getComments(callback) {
        const url = `api/comments/${this.slug}`;
        fetch(url)
        .then(function (res) {
            if (res.status === 200) {
                callback(res.json());
            }
        });
    }

    sendComment(text, handles) {
        const url = `api/comments/${this.slug}`;
        fetch(url, {method: 'POST', body: JSON.stringify({text: text})})
        .then(function (res) {
            if (res.status !== 200) {
                return handles.handleFailedSend(res.status);
            }

            handles.handleSuccessfulSend();
        })
        .catch(handles.handleNoConnecting);
    }
}

module.exports = new CommentsPoster();
