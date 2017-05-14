class QuestSender {
    constructor() {
        this.beginPlay = this.beginPlay.bind(this);
        this.getQuestInfo = this.getQuestInfo.bind(this);
        this.likeQuest = this.likeQuest.bind(this);
        this.setSlug = this.setSlug.bind(this);
    }

    setSlug(slug) {
        this.slug = slug;
    }

    getQuestInfo() {
        return {
            url: `./${this.slug}/info`,
            options: {
                method: 'GET',
                credentials: 'include'
            },
            parser: res => res.json()
        };
    }

    likeQuest() {
        return {
            url: `../api/quests/${this.slug}/like`,
            options: {
                method: 'POST',
                credentials: 'include'
            }
        };
    }

    beginPlay() {
        return {
            url: `./${this.slug}/start`,
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
        };
    }
}

module.exports = new QuestSender();
