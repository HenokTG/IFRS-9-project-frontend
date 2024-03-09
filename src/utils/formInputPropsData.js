export const listOfBanks = [
  'Bank S4',
  'Bank S7',
  'Bank S10',
  'Abay Bank S.C.',
  'Addis International Bank',
  'Awash International Bank',
  'Bank of Abyssinia',
  'Berhan International Bank',
  'Buna International Bank',
  'Commercial Bank of Ethiopia',
  'Cooperative Bank of Oromia',
  'Dashen Bank',
  'Debub Global Bank',
  'Development Bank of Ethiopia',
  'Enat Bank',
  'Hijra Bank',
  'Lion International Bank',
  'Nib International Bank',
  'Oromia International Bank',
  'Siinqee Bank',
  'United Bank (Ethiopia)',
  'Wegagen Bank',
  'Zemen Bank',
  'ZamZam Bank',
];

export const registerData = [
  {
    newName_: 'username',
    newLable_: 'Username',
    newType_: 'text',
  },
  {
    newName_: 'email',
    newLable_: 'Email Address',
    newType_: 'email',
  },
  {
    newName_: 'password1',
    newLable_: 'Password',
    newType_: 'password',
  },
  {
    newName_: 'password2',
    newLable_: 'Confirm Password',
    newType_: 'password',
  },
];

export const profileData = [
  {
    newName_: 'first_name',
    newLable_: 'Enter First Name',
  },
  {
    newName_: 'last_name',
    newLable_: 'Enter Last Name',
  },
  {
    newName_: 'Department',
    newLable_: 'Enter Department',
  },
  {
    newName_: 'Job_title',
    newLable_: 'Enter Job Title',
  },
];

export const minMaxFLIValues = [
  { fieldDefaultValue_: 1.05, inputLabel: 'Expected Minimum FLI Value', inputName: 'minFLI' },
  { fieldDefaultValue_: 1.55, inputLabel: 'Expected Maximum FLI Value', inputName: 'maxFLI' },
];

export const scenarioData = [
  {
    fieldName_: 'baseCase',
    fieldLable_: 'Base Scenario',
    fieldDefaultValue_: 50,
  },
  {
    fieldName_: 'upsideCase',
    fieldLable_: 'Upside Scenario',
    fieldDefaultValue_: 25,
  },
  {
    fieldName_: 'downsideCase',
    fieldLable_: ' Downside Scenario',
    fieldDefaultValue_: 25,
  },
];

export const AssumedECLInputData = [
  {
    fieldName_: 'minLGD',
    fieldLable_: 'Minimum LGD',
    fieldDefaultValue_: 10,
  },
  {
    fieldName_: 'minPD',
    fieldLable_: 'Minimum PD',
    fieldDefaultValue_: 0.05,
  },
  {
    fieldName_: 'otherAssetsCCCF',
    fieldLable_: 'Other Assets CCF',
    fieldDefaultValue_: 100,
  },
];
