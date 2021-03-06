import chai from 'chai';
// import 'chai/register-should';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const expect  = chai.expect()
const should = chai.should()

describe('login and signup', () => {
  before(function () {
    this.timeout(20000); // 20 second timeout for setup
  });
  /**
   * Test the POST /auth/signup endpoint
   */
  describe('POST /auth/signup', () => {
    it('it should create a new user', (done) => {
      // this.timeout(30000);
      function makeUniqueUser(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
     }
   return result;
}
      const newUser = {
        email: makeUniqueUser(15)+'@gmail.com',
        firstName: 'tester',
        lastName: 'testers',
        password: 'password',
        confirmPassword: 'password',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('firstName');
          res.body.data.should.have.property('lastName');
          res.body.data.should.have.property('type').eql('client');
          done();
        });
    });

    it('it should throw an error if the email address is already taken', (done) => {
      const newUser = {
        email: 'juwavictor@gmail.com',
        firstName: 'tester',
        lastName: 'testers',
        password: 'password',
        confirmPassword: 'password',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('a user with this email address already exist');
          done();
        });
    });

    it('it should throw an error if firstName is missing in the request body', (done) => {
      const invalidPayload = {
        lastName: 'tester',
        email: 'testnew@gmail.com',
        password: 'password',
        confirmPassword: 'password',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(invalidPayload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('firstName is required');
          done();
        });
    });

    it('it should throw an error if lastName is missing in the request body', (done) => {
      const invalidPayload = {
        firstName: 'tester',
        email: 'testnew@gmail.com',
        password: 'password',
        confirmPassword: 'password',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(invalidPayload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('lastName is required');
          done();
        });
    });

    it('it should throw an error if email is missing in the request body', (done) => {
      const invalidPayload = {
        firstName: 'tester',
        lastName: 'tester',
        password: 'password',
        confirmPassword: 'password',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(invalidPayload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('email is required');
          done();
        });
    });

    it('it should throw an error if password is less than 7 characters', (done) => {
      const invalidPayload = {
        firstName: 'tester',
        lastName: 'tester',
        email: 'test@gmail.com',
        password: 'passw',
        confirmPassword: 'passw',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(invalidPayload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('password length must be at least 7 characters long');
          done();
        });
    });


    it('it should throw an error if password does not match confirm password', (done) => {
      const invalidPayload = {
        firstName: 'tester',
        lastName: 'tester',
        email: 'test@gmail.com',
        password: 'password',
        confirmPassword: 'passw',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(invalidPayload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('your password and confirm password do not match');
          done();
        });
    });
  });

 
  describe('POST /auth/signin', () => {
    it('it should sign in a user', (done) => {
      const loginCredential = {
        email: 'juwavictor@gmail.com',
        password: 'mypassword',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(loginCredential)
        .end((err, res) => {
          // console.log(res)
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('firstName');
          res.body.data.should.have.property('lastName');
          res.body.data.should.have.property('email');
          done();
        });
    });

    it('it should throw an error if email is missing in the rquest body', (done) => {
      const loginCredential = {
        password: 'password',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(loginCredential)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('email is required');
          done();
        });
    });


    it('it should throw an error if password is missing in the rquest body', (done) => {
      const loginCredential = {
        email: 'test@gmail.com',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(loginCredential)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('password is required');
          done();
        });
    });


    it('it should throw an error if user supply a wrong email or password combination ', (done) => {
      const loginCredential = {
        email: 'testy@gmail.com',
        password: 'mypassword',
      };

      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(loginCredential)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('invalid user credentials');
          done();
        });
    });
  });
});
