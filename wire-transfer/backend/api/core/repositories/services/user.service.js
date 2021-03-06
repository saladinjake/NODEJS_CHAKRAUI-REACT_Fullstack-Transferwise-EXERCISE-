import Utils from '../../helpers/common';
import UserModel from '../../models/user.model';
import mailer from '../../helpers/mailer';

const User = new UserModel('users');
class UserService {
 
  static async createUser(user) {
    try {
      const isUser = await User.findUserByEmail(user.email);
      console.log(isUser)
      if (typeof isUser=="object" && "email" in isUser) {
        throw new Error('a user with this email address already exist');
      }


      const newUser = user;
      newUser.type = 'client';
      newUser.isAdmin = false;
      newUser.password = Utils.hashPassword(user.password);
      const createdUser = await User.createUser(newUser);
      const {
        id, type, isadmin, firstname, lastname, email,
      } = createdUser;
      const payload = {
        id,
        type,
        isAdmin: isadmin,
      };
      const plainPassword =user.password;
      const mailData = {
        subject: 'An account has created for you on Transferwiser',
        text: 'Kindly use the credentials in this mail to login to your account',
        to: email,
        html: `<b>Email Adress: ${email}<br/><br/>
          Password: ${plainPassword}<br/><br/>
          Visit <a href='https://transferwise-apitest.herokuapp.com/'>TWISER App</a> today</b>`,
      };

      await mailer(mailData);
      const token = Utils.jwtSigner(payload);
      return {
        token,
        id,
        firstName: firstname,
        lastName: lastname,
        email,
        isAdmin: isadmin,
        type,
      };
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
  static async signUser(login) {
    // console.log(login)
    try {
      const user = await User.findUserByEmail(login.email);
      // console.log(user)
      if (user) {
        const bycrptResponse = Utils.validatePassword(login.password, user.password);
        if (bycrptResponse) {
          const {
            id, firstname, lastname, isadmin, password: userPassword, ...data
          } = user;
          const userProfile = {
            id,
            isAdmin: isadmin,
            ...data,
          };
          const token = Utils.jwtSigner(userProfile);
          
          return {
            token,
            id,
            firstName: firstname,
            lastName: lastname,
            isAdmin: isadmin,
            ...userProfile,
          };
        }
      }
      throw new Error('invalid user credentials');
    } catch (err) {
      throw err;
    }
  }


  static async searchFinder(){
    try {
      const { rows } = await this.select('firstName, lastName');
      // console.log(user)
      if (rows) {
        const usersData = rows;
        console.log(usersData)
        return usersData
      }
      throw new Error('no users match');
    }catch(error){
      throw new Error('no users match');
    }
  }


  
}

export default UserService;
