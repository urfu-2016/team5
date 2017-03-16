'use strict';

const assert = require('assert');
const Image = require('../../models/image');

const src = 'src';
const description = 'description';
const title = 'title';
const location = 'location';


describe('models:image', () => {
    it('initialization', () => {
        const image = new Image({
            src,
            description,
            title,
            location
        });

        assert.equal(image.src, src);
        assert.equal(image.description, description);
        assert.equal(image.title, title);
        assert.equal(image.location, location);
    })

})
