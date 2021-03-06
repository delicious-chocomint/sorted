import React from 'react';
import PropTypes from 'prop-types';
import { Text, SafeAreaView, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCavy } from 'cavy';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import ErrorMessage from '../../components/ErrorMessage';
import { withFirebaseHOC } from '../../config/Firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 150,
  },
  text: {
    color: '#333',
    fontSize: 24,
    marginLeft: 25,
  },
  buttonContainer: {
    margin: 25,
  },
});

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
});

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    passwordReset: PropTypes.func.isRequired,
  }).isRequired,
};

function ForgotPassword({ navigation, firebase }) {
  const generateTestHook = useCavy();

  async function handlePasswordReset(values, actions) {
    const { email } = values;

    try {
      await firebase.passwordReset(email);
      alert('Password reset email sent successfully!');
      navigation.navigate('Login');
    } catch (error) {
      actions.setFieldError('general', error.message);
    }
  }

  function goToLogin() {
    return navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={styles.text}
        ref={generateTestHook('ForgotPassword.MainText')}
      >
        Forgot Password?
      </Text>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values, actions) => {
          handlePasswordReset(values, actions);
        }}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          values,
          handleSubmit,
          errors,
          isValid,
          touched,
          handleBlur,
          isSubmitting,
        }) => (
          <>
            <FormInput
              name="email"
              value={values.email}
              onChangeText={handleChange('email')}
              placeholder="Enter email"
              autoCapitalize="none"
              iconName="ios-mail"
              iconColor="#2C384A"
              onBlur={handleBlur('email')}
              returnKeyType="done"
              keyboardType="email-address"
              ref={generateTestHook('ForgotPassword.EmailInput')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="Send Email"
                buttonColor="#039BE5"
                disabled={!isValid || isSubmitting}
                ref={generateTestHook('ForgotPassword.ForgotPasswordButton')}
              />
            </View>
            <ErrorMessage errorValue={errors.general} />
          </>
        )}
      </Formik>
      <Button
        title="Remembered your password? Login"
        onPress={goToLogin}
        titleStyle={{
          color: '#039BE5',
        }}
        type="clear"
        ref={generateTestHook('ForgotPassword.LoginButton')}
      />
    </SafeAreaView>
  );
}

ForgotPassword.propTypes = propTypes;

export default withFirebaseHOC(ForgotPassword);
