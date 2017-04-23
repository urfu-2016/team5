class CommentsPoster {
    constructor() {
        this.sendComment = this.sendComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.setSlug = this.setSlug.bind(this);
    }

    setSlug(slug) {
        this.slug = slug;
    }

    getComments(data, handles) {
        const url = `api/comments/${this.slug}`;
        fetch(url)
            .then(function (res) {
                if (!res.ok) {
                    return handles.handleFailedSend(res.status);
                }

                handles.handleSuccessfulSend(res.json());
            })
            .catch(function () {
                setTimeout(handles.handleNoConnecting, 0);
            });
    }

    sendComment(text, handles) {
        const url = `api/comments/${this.slug}`;
        fetch(url, {method: 'POST', body: JSON.stringify({text: text})})
            .then(function (res) {
                if (!res.ok) {
                    return handles.handleFailedSend(res.status);
                }

                handles.handleSuccessfulSend();
            })
            .catch(function () {
                setTimeout(handles.handleNoConnecting, 0);
            });
    }
}

module.exports = new CommentsPoster();
