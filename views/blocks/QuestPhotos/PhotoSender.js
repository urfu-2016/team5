class PhotoSender {
    constructor() {
        this.sendPosition = this.sendPosition.bind(this);
        this.getPhotos = this.getPhotos.bind(this);
        this.setSlug = this.setSlug.bind(this);
    }

    setSlug(slug) {
        this.slug = slug;
    }

    getPhotos() {
        return {
            url: `../api/quests/${this.slug}/photos`,
            options: {
                method: 'GET',
                credentials: 'include'
            },
            parser: res => res.json()
        };
    }

    sendPosition(id, position) {
        return {
            url: `../api/quests/${this.slug}/photos/${id}/check`,
            options: {
                method: 'POST',
                body: JSON.stringify(position),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            },
            parser: res => res.json()
        };
    }
}

module.exports = new PhotoSender();
