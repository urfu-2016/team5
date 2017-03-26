const accountModel = require('../../models/account');
const Account = require('mongoose').model('Account');
require('chai').should();

const account = {
    nickname: 'nick',
    password: 'pass'
};

describe('models:account', () => {
    beforeEach(() => {
        return Account
            .remove({})
            .exec();
    });

    it('creates account', () => {
        return accountModel
           .create(account)
           .then(() => {
               return Account
                   .find({})
                   .exec();
           })
           .then(accounts => {
               accounts.length
                    .should.be.equal(1);

               accounts[0].get('nickname')
                    .should.be.equal(account.nickname);
           });
    });

    it('verifies password', () => {
        return accountModel
            .create(account)
            .then(() => {
                return accountModel.verifyPassword(account);
            })
            .then(res => {
                res.should.be.equal(true);
            });
    });

    it('changes password', () => {
        const newPassword = 'newPassword';

        return accountModel
            .create(account)
            .then(() => {
                return accountModel.changePassword(account, newPassword);
            })
            .then(() => {
                return accountModel.verifyPassword({
                    nickname: account.nickname,
                    password: newPassword
                });
            })
            .then(verificationResult => {
                verificationResult.should.be.equal(true);
            })
            .then(() => {
                return Account
                    .find({})
                    .exec();
            })
            .then(accs => {
                accs.length
                    .should.be.equal(1);
            });
    });
});
