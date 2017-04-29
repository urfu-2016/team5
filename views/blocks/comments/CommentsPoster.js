class CommentsPoster {
    constructor() {
        this.sendComment = this.sendComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.getComment = this.getComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.likeComment = this.likeComment.bind(this);
        this.setSlug = this.setSlug.bind(this);
    }

    setSlug(slug) {
        this.slug = slug;
    }

    checkStatus(res) {
        if (res.ok) {
            return res;
        }

        throw this.getCustomError(res.statusText, false);
    }

    getCustomError(message, isNoConection) {
        var error = new Error(message);
        error.isNoConection = isNoConection;
        return error;
    }

    request(url, options, handles) {
        fetch(url, options)
            .then(this.checkStatus,
                error => {
                    throw this.getCustomError(error.message, true);
                })
            .then(res => res.json())
            .then(handles.handleSuccessfulSend)
            .catch(handles.handleFailedSend);
    }

    getComment(handles, id) {
        this.request(`api/comments/${this.slug}/${id}`,
            {
                method: 'GET',
                credentials: 'include'
            }, handles);
    }

    getComments(handles) {
        this.request(`api/comments/${this.slug}`,
            {
                method: 'GET',
                credentials: 'include'
            }, handles);
    }

    sendComment(handles, text) {
        this.request(`api/comments/${this.slug}`,
            {
                method: 'POST',
                body: JSON.stringify({text}),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }, handles);
    }

    removeComment(handles, id) {
        this.request(`api/comments/${this.slug}/${id}`,
            {
                method: 'DELETE',
                credentials: 'include'
            }, handles);
    }

    likeComment(handles, id) {
        this.request(`api/comments/${this.slug}/${id}/like`,
            {
                method: 'POST',
                credentials: 'include'
            }, handles);
    }
}

module.exports = new CommentsPoster();
