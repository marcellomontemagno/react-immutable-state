import React from 'react';

describe('Immutable State', () => {

    it('NODE_ENV must be !== "production"', () => {
        expect(process.env.NODE_ENV).not.toBe('production');
    });

});
