import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
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
    marginTop: 50,
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 25,
  },
  checkBoxContainer: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password should be at least 6 characters '),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must matched Password')
    .required('Confirm Password is required'),
  check: Yup.boolean().oneOf([true], 'Please check the agreement'),
});

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    signupWithEmail: PropTypes.func.isRequired,
    retrieveUser: PropTypes.func.isRequired,
    createNewUser: PropTypes.func.isRequired,
  }).isRequired,
};

function Signup({ navigation, firebase }) {
  const generateTestHook = useCavy();

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState('ios-eye');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('ios-eye');
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(
    true
  );

  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const passwordConfirmInput = useRef(null);

  function goToLogin() {
    return navigation.navigate('Login');
  }

  function handlePasswordVisibility() {
    if (passwordIcon === 'ios-eye') {
      setPasswordIcon('ios-eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (passwordIcon === 'ios-eye-off') {
      setPasswordIcon('ios-eye');
      setPasswordVisibility(!passwordVisibility);
    }
  }

  function handleConfirmPasswordVisibility() {
    if (confirmPasswordIcon === 'ios-eye') {
      setConfirmPasswordIcon('ios-eye-off');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordIcon === 'ios-eye-off') {
      setConfirmPasswordIcon('ios-eye');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  }

  async function handleOnSignup(values, actions) {
    const { name, email, password } = values;

    try {
      await firebase.signupWithEmail(email, password, name);

      if (firebase.retrieveUser().uid) {
        const { uid } = firebase.retrieveUser();
        const userData = { email, name, uid };
        await firebase.createNewUser(userData);
        navigation.navigate('App');
      }
    } catch (error) {
      actions.setFieldError('general', error.message);
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} enabled>
      <ScrollView>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            check: false,
          }}
          onSubmit={(values, actions) => {
            handleOnSignup(values, actions);
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
            setFieldValue,
          }) => (
            <>
              <FormInput
                name="name"
                value={values.name}
                onChangeText={handleChange('name')}
                placeholder="Enter your full name"
                iconName="md-person"
                iconColor="#2C384A"
                onBlur={handleBlur('name')}
                ref={
                  global.isTestingEnvironment
                    ? generateTestHook('Signup.NameInput')
                    : nameInput
                }
                onSubmitEditing={() => emailInput.current.focus()}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
              <FormInput
                name="email"
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder="Enter email"
                autoCapitalize="none"
                iconName="ios-mail"
                iconColor="#2C384A"
                onBlur={handleBlur('email')}
                ref={
                  global.isTestingEnvironment
                    ? generateTestHook('Signup.EmailInput')
                    : emailInput
                }
                onSubmitEditing={() => passwordInput.current.focus()}
                blurOnSubmit={false}
                returnKeyType="next"
                keyboardType="email-address"
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <FormInput
                name="password"
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder="Enter password"
                iconName="ios-lock"
                iconColor="#2C384A"
                onBlur={handleBlur('password')}
                secureTextEntry={passwordVisibility}
                rightIcon={
                  <TouchableOpacity onPress={handlePasswordVisibility}>
                    <Ionicons name={passwordIcon} size={28} color="grey" />
                  </TouchableOpacity>
                }
                ref={
                  global.isTestingEnvironment
                    ? generateTestHook('Signup.PasswordInput')
                    : passwordInput
                }
                onSubmitEditing={() => passwordConfirmInput.current.focus()}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <FormInput
                name="password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                placeholder="Confirm password"
                iconName="ios-lock"
                iconColor="#2C384A"
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={confirmPasswordVisibility}
                rightIcon={
                  <TouchableOpacity onPress={handleConfirmPasswordVisibility}>
                    <Ionicons
                      name={confirmPasswordIcon}
                      size={28}
                      color="grey"
                    />
                  </TouchableOpacity>
                }
                ref={
                  global.isTestingEnvironment
                    ? generateTestHook('Signup.PasswordConfirmInput')
                    : passwordConfirmInput
                }
                onSubmitEditing={
                  !isValid || isSubmitting
                    ? () => alert('Please check your inputs and try again.')
                    : handleSubmit
                }
                returnKeyType="done"
              />
              <ErrorMessage
                errorValue={touched.confirmPassword && errors.confirmPassword}
              />
              <CheckBox
                containerStyle={styles.checkBoxContainer}
                checkedIcon="check-box"
                iconType="material"
                uncheckedIcon="check-box-outline-blank"
                title="Agree to terms and conditions"
                checkedTitle="You agreed to our terms and conditions"
                checked={values.check}
                onPress={() => setFieldValue('check', !values.check)}
                ref={generateTestHook('Signup.AgreeCheckBox')}
              />
              <Text style={{ textAlign: 'center', margin: 13 }}>
                Your email will only be used if you wish to reset your password.
                {'\n\n'}
                If you do not want to give us your details, feel free to use a
                fake email/name but please note that you will not be able to
                reset your password in that case.
              </Text>
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType="outline"
                  onPress={handleSubmit}
                  title="SIGNUP"
                  buttonColor="#F57C00"
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                  ref={generateTestHook('Signup.SignupButton')}
                />
              </View>
              <ErrorMessage errorValue={errors.general} />
            </>
          )}
        </Formik>
        <Button
          title="Have an account? Login"
          onPress={goToLogin}
          titleStyle={{
            color: '#039BE5',
          }}
          type="clear"
          ref={generateTestHook('Signup.LoginButton')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

Signup.propTypes = propTypes;

export default withFirebaseHOC(Signup);
