import chai from 'chai';
// import 'chai/register-should';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

describe('Test transaction related endpoints - Debit and Credit an account', () => {
  let userToken = null;
  let identitySignOn =null;

  before('Sign in as user to obtain auth token to be used in other account operations', (done) => {
    const userCredential = {
      email: 'juwavictor@gmail.com',
      password: 'mypassword',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(userCredential)
      .end((err, res) => {
        res.should.have.status(200);
        if (!err) {
          userToken = res.body.data.token;
           identitySignOn = res.body.data.id;
        }
        done();
      });
  });

  describe('POST /transactions/:accountNumber/debit', () => {
    before('Sign in as a user', (done) => {
      const userCredential = {
        email: 'simba@gmail.com', //the software company making payments to its developers
        password: 'mypassword',
      };

      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(userCredential)
        .end((err, res) => {
          res.should.have.status(200);
          if (!err) {
            userToken = res.body.data.token;
            identitySignOn = res.body.data.id;
          }
          done();
        });
    });

    it('it should throw permission error if user is not a loggedin', (done) => {
      const accountNumber = 2220107727;
      const body = { amount: 50000,receipientId:"juwavictor@gmail.com" };
      chai
        .request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', null)
        .send(body)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });


    it('it should throw an insufficient balance error', (done) => {
      const accountNumber = 2220006727;
      const receipientId ="juwavictor@gmail.com" 
      const body = { amount: 500000000000,  receipientId};
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', userToken)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('account balance is not sufficient');
          done();
        });
    });

    it('it should throw an error when account number is not found', (done) => {
      const accountNumber = 22299084472999;
      const body = { amount: 50000,receipientId:"juwavictor@gmail.com" };

      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', userToken)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('account number doesn\'t exist');
          done();
        });
    });

    it('it should throw an error when "amount" in request body is not provided ', (done) => {
      const accountNumber = 2220107727;
      const body = {receipientId:"juwavictor@gmail.com"};
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', userToken)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .eql('amount is required');
          done();
        });
    });


    it('it should throw an error when "email " in request body is invalid', (done) => {
      const accountNumber = 2220107727;
      const body = {amount:500,receipientId:"juwa.$$$victor.@@@@gmail.com"};
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', userToken)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .eql('receipientId must be a valid email');
          done();
        });
    });

    it('it should throw an error when "amount" is not a number', (done) => {
      const accountNumber = 2220107727;
      const body = { amount: '50000hrh',receipientId:"juwavictor@gmail.com" };
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', userToken)
        .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .eql('amount must be a number');
          done();
        });
    });

    it('it throws an error if account number is invalid', (done) => {
      const accountNumber = '2220107727hsds.fjd';
      const body = { amount: 500,receipientId:"juwavictor@gmail.com" };
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', userToken)
        .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          // res.body.should.have.property('error').eql('invalid input syntax for type bigint');
          done();
        });
    });

    it('it should debit a wallet account', (done) => {
      const accountNumber = 2220107727;
      console.log(identitySignOn)
      const body = { amount: 500,receipientId:"juwavictor@gmail.com" };
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-access-token', userToken)
        // .set('x-identifier-transferwise-app', JSON.stringify(identitySignOn))
        .send(body)
        .end((err, res) => {
          console.log(err)
          console.log(res)
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('accountNumber').eql(accountNumber);
          res.body.data.should.have.property('transactionId');
          res.body.data.should.have.property('amount');
          res.body.data.should.have.property('transactionType');
          res.body.data.should.have.property('accountBalance');
          done();
        });
    });
  });










  /**
     * Test the POST /transactions/:accountNumber/credit route
     */
  describe('POST /transactions/:accountNumber/credit', () => {
    it('it should throw permission error if user is not a valid with token', (done) => {
      const accountNumber = 2220107727;
      const body = { amount: 500,receipientId:"juwavictor@gmail.com" };
      chai
        .request(app)
        .post(`/api/v1/transactions/${accountNumber}/credit`)
        .set('x-access-token',null)
  .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('invalid request token');
          done();
        });
    });


    it('it should throw an error when account number is not found', (done) => {
      const accountNumber = 22201044484472;
      const body = { amount: 500,receipientId:"juwavictor@gmail.com" };

      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/credit`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          //res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('account number doesn\'t exist');
          done();
        });
    });

    it('it should throw an error when "amount" in request body is not provided ', (done) => {
      const accountNumber = 2220107727;
      const body = { receipientId:"juwavictor@gmail.com" }
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/credit`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .eql('amount is required');
          done();
        });
    });

    it('it should throw an error when "amount" is not a number', (done) => {
      const accountNumber = 222010872;
      const body = { amount: '50000hrh' ,receipientId:"juwavictor@gmail.com"};
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/credit`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .eql('amount must be a number');
          done();
        });
    });

    it('it should throw an error if account number is invalid', (done) => {
      const accountNumber = '2220107727hsds.fjd';
      const body = { amount: 500,receipientId:"juwavictor@gmail.com" };
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/credit`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('invalid input syntax for integer: "2220107727hsds.fjd"');
          done();
        });
    });

    it('it should credit a wallet account', (done) => {
      const accountNumber = 2220006727; 
      const body = { amount: 50000,receipientId:"test@gmail.com" };
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/credit`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('accountNumber').eql(accountNumber);
          res.body.data.should.have.property('transactionId');
          res.body.data.should.have.property('amount');
          res.body.data.should.have.property('transactionType');
          res.body.data.should.have.property('accountBalance');
          done();
        });
    });
  });

  // /**
  //    * Test the GET accounts/:accountNumber/transactions route
  //    */
  describe('GET accounts/:accountNumber/transactions', () => {
    

    it('it should throw an error when account number is not valid', (done) => {
      const accountNumber = '2220107727hhd';

      chai
        .request(app)
        .get(`/api/v1/accounts/${accountNumber}/transactions`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error')
          done();
        });
    });

    it('it should throw an error when account number is not found', (done) => {
      const accountNumber = 2220107727890;

      chai
        .request(app)
        .get(`/api/v1/accounts/${accountNumber}/transactions`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('account number doesn\'t exist');
          done();
        });
    });

    it('it should get an account transactions', (done) => {
      const accountNumber = 2220107727;

      chai
        .request(app)
        .get(`/api/v1/accounts/${accountNumber}/transactions`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /transactions/:transactionId', () => {
    it('it should throw an error when transaction id is not found', (done) => {
      const transactionId = 0;

      chai
        .request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('transaction id doesn\'t exist');
          done();
        });
    });

    it('it should throw an error when transaction id not valid', (done) => {
      const transactionId = '1f';

      chai
        .request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error')
          done();
        });
    });

    it('it should get a specific transaction', (done) => {
      const transactionId = 1;

      chai
        .request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('x-access-token', userToken)
  .set('x-identifier-transferwise-app', identitySignOn)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('transactionId');
          res.body.data.should.have.property('created_at');
          res.body.data.should.have.property('type');
          res.body.data.should.have.property('accountNumber');
          res.body.data.should.have.property('amount');
          res.body.data.should.have.property('oldBalance');
          res.body.data.should.have.property('newBalance');
          done();
        });
    });

  //   it('it should throw permission error if user wants to see other users transactions', (done) => {
  //     const transactionId = 6;

  //     chai
  //       .request(app)
  //       .get(`/api/v1/transactions/${transactionId}`)
  //       .set('x-access-token', userToken)
  // .set('x-identifier-transferwise-app', identitySignOn)
  //       .end((err, res) => {
  //         res.should.have.status(403);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('error').eql('only a staff has the permission to view other accounts and transactions');
  //         done();
  //       });
  //   });
  });
});
