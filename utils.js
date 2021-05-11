const {
  CognitoIdentity
} = require("aws-sdk");
const AwsSdk = require("aws-sdk");

AwsSdk.config.setPromisesDependency();
AwsSdk.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const whetherEmailIsRegistered = async (email) => {
  const user = await getUserByEmail(email);
  return !!user // convert from truthy to bool
};

const getUserByEmail = async (email) => {
  const cognito = new AwsSdk.CognitoIdentityServiceProvider();
  const params = {
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    Filter: `email = "${email}"`,
  };
  const response = await cognito.listUsers(params).promise();

  /*
    {
        "Username": "3de6655e-6729-4900-8589-936cb9b10386",
        "Attributes": [
            {
                "Name": "sub",
                "Value": "3de6655e-6729-4900-8589-936cb9b10386"
            },
            {
                "Name": "email_verified",
                "Value": "true"
            },
            {
                "Name": "phone_number_verified",
                "Value": "false"
            },
            {
                "Name": "email",
                "Value": "harrisonhuang00@gmail.com"
            },
            {
                "Name": "picture",
                "Value": "s3.com"
            }
        ],
        "UserCreateDate": "2021-04-15T09:09:35.142Z",
        "UserLastModifiedDate": "2021-05-06T20:52:57.353Z",
        "Enabled": true,
        "UserStatus": "CONFIRMED"
    }
  */
  return response.Users.pop();
};

const getUserProfilePic = async (email) => {
  const cognito = new AwsSdk.CognitoIdentityServiceProvider();

  const params = {
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    Filter: `email = "${email}"`,
    AttributesToGet: [
      'picture'
    ]
  };

  try {
    const response = await cognito.listUsers(params).promise();
    // should be Users[0] b/c emails are unique and response will then contain one user
    // only getting 1 attribute, so attribute 0 will contain {Name: 'picture', Value: 'pfpValue'}
    return response.Users.pop().Attributes.pop().Value;
  } catch (err) {
    return ({
      'error w/ fetching user using given email': email,
      'error' : err.stack
    });
  }
}

module.exports = {
  whetherEmailIsRegistered,
  getUserByEmail,
  getUserProfilePic
}