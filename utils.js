const aws = require("aws-sdk");

const whetherEmailIsRegistered = async (email) => {
  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const cognito = new aws.CognitoIdentityServiceProvider();
  const params = {
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    Filter: `email = "${email}"`,
  };
  const response = await cognito.listUsers(params).promise();

  return response.Users.length > 0;
};

module.exports = {
    whetherEmailIsRegistered
}