import React from 'react';
import { connect } from 'react-redux';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { login, socialLogin } from '../authActions';
import SocialLogin from '../SocialLogin/SocialLogin';


const maptDispatchToProps = {
  login,
  socialLogin
}

                            //handleSubmit coming from reduxForm property for submiting a form using redux
const LoginForm = ({login, handleSubmit, error, socialLogin}) => {
  return (
    <Form size="large" onSubmit={handleSubmit(login)}>
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        {error && <Label basic color="red">{error }</Label>}
        <Button fluid size="large" color="teal">
          Login
        </Button>
        <Divider horizontal>
          OR
        </Divider>
          <SocialLogin socialLogin={socialLogin} />
      </Segment>
    </Form>
  );
};

export default connect(null, maptDispatchToProps)(reduxForm({form:'loginForm'})(LoginForm));