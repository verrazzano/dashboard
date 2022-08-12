// Added by Verrazzano
<script>
import LabeledInput from '@/components/form/LabeledInput';
import FileSelector, { createOnSelected } from '@/components/form/FileSelector';
import SecretHelper from './secret-helper';
export default {
  components: { LabeledInput, FileSelector },

  mixins: [SecretHelper],

  props: {
    value: {
      type:     Object,
      required: true,
    },

    mode: {
      type:     String,
      required: true,
    }
  },

  data() {
    return {
      username: '',
      password: ''
    };
  },

  watch: {
    username() {
      this.setData('ssh-publickey', this.username);
    },
    password() {
      this.setData('ssh-privatekey', this.password);
    },
  },

  created() {
    if (this.username === '') {
      this.username = this.getUsername();
    }

    if (this.password === '') {
      this.password = this.getPassword();
    }
  },
  methods: {
    onUsernameSelected: createOnSelected('username'),
    onPasswordSelected: createOnSelected('password'),

    getUsername() {
      return this.decodedData['ssh-publickey'] || '';
    },

    getPassword() {
      return this.decodedData['ssh-privatekey'] || '';
    },
  },

};
</script>

<template>
  <div>
    <div class="row mb-20">
      <div class="col span-6">
        <LabeledInput
          v-model="username"
          type="multiline"
          :label="t('secret.ssh.public')"
          :mode="mode"
          required
          :placeholder="t('secret.ssh.publicPlaceholder')"
        />
        <FileSelector class="btn btn-sm bg-primary mt-10" :label="t('generic.readFromFile')" @selected="onUsernameSelected" />
      </div>
      <div class="col span-6">
        <LabeledInput
          v-model="password"
          type="multiline"
          :label="t('secret.ssh.private')"
          :mode="mode"
          required
          :placeholder="t('secret.ssh.privatePlaceholder')"
        />
        <FileSelector class="btn btn-sm bg-primary mt-10" :label="t('generic.readFromFile')" @selected="onPasswordSelected" />
      </div>
    </div>
  </div>
</template>
