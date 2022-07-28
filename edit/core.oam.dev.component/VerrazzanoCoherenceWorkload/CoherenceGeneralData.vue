<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';

import { NAMESPACE, SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';
import Checkbox from '@/components/form/Checkbox';

export default {
  name:       'CoherenceGeneralData',
  components: {
    Checkbox,
    LabeledInput,
    LabeledSelect,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      // the VerrazzanoCoherenceWorkload spec
      type:     Object,
      required: true
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  data() {
    const imagePullSecrets = (this.getWorkloadSpecListField('imagePullSecrets') || []).map(each => each.name);

    return {
      fetchInProgress:    true,
      namespace:          this.value.metadata?.namespace,
      allNamespaces:      [],
      allSecrets:         {},
      secrets:            [],
      imagePullSecrets,
    };
  },
  async fetch() {
    this.allSecrets = {};

    const requests = { namespaces: this.$store.dispatch('cluster/findAll', { type: NAMESPACE }) };

    if (this.$store.getters['cluster/schemaFor'](SECRET)) {
      requests.secrets = this.$store.dispatch('cluster/findAll', { type: SECRET });
    }

    const hash = await allHash(requests);

    this.allNamespaces = hash.namespaces;

    if (hash.secrets) {
      this.sortObjectsByNamespace(hash.secrets, this.allSecrets);
    }
    this.fetchInProgress = false;
  },
  methods: {
    resetSecrets() {
      if (!this.fetchInProgress) {
        this.secrets = this.allSecrets[this.namespace] || [];
      }
    },
    setImagePullSecrets(value) {
      this.setFieldIfNotEmpty('imagePullSecrets', value);
    }
  },
  watch: {
    fetchInProgress() {
      this.resetSecrets();
    },
    'value.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecrets();
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-9">
        <LabeledInput
          :value="getField('image')"
          :mode="mode"
          :label="t('verrazzano.common.fields.image')"
          :placeholder="getNotSetPlaceholder(value, 'image')"
          @input="setFieldIfNotEmpty('image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('imagePullPolicy')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'imagePullPolicy')"
          :label="t('verrazzano.common.fields.imagePullPolicy')"
          :options="imagePullPolicyOptions"
          option-key="value"
          @input="setFieldIfNotEmpty('imagePullPolicy', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-9">
        <LabeledInput
          :value="getField('coherenceUtils.image')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.coherenceUtilsImage')"
          :placeholder="getNotSetPlaceholder(value, 'coherenceUtils.image')"
          @input="setFieldIfNotSet('coherenceUtils.image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('coherenceUtils.imagePullPolicy')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'coherenceUtils.imagePullPolicy')"
          :label="t('verrazzano.coherence.fields.coherenceUtilsImagePullPolicy')"
          :options="imagePullPolicyOptions"
          option-key="value"
          @input="setFieldIfNotSet('coherenceUtils.imagePullPolicy', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-9">
        <LabeledSelect
          :value="imagePullSecrets"
          :label="t('verrazzano.common.fields.imagePullSecrets')"
          :placeholder="getNotSetPlaceholder(value, 'imagePullSecrets')"
          :multiple="true"
          :taggable="true"
          :options="secrets"
          :mode="mode"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          @input="setImagePullSecrets($event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('replicas')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'replicas')"
          :label="t('verrazzano.common.fields.replicas')"
          @input="setNumberField('replicas', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('cluster')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'cluster')"
          :label="t('verrazzano.coherence.fields.cluster')"
          @input="setFieldIfNotEmpty('cluster', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('role')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'role')"
          :label="t('verrazzano.coherence.fields.role')"
          @input="setFieldIfNotEmpty('role', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('appLabel')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'appLabel')"
          :label="t('verrazzano.coherence.fields.appLabel')"
          @input="setFieldIfNotEmpty('appLabel', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('versionLabel')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'versionLabel')"
          :label="t('verrazzano.coherence.fields.versionLabel')"
          @input="setFieldIfNotEmpty('versionLabel', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('rackLabel')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'rackLabel')"
          :label="t('verrazzano.coherence.fields.rackLabel')"
          @input="setFieldIfNotEmpty('rackLabel', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('siteLabel')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'siteLabel')"
          :label="t('verrazzano.coherence.fields.siteLabel')"
          @input="setFieldIfNotEmpty('siteLabel', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('shareProcessNamespace')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.shareProcessNamespace')"
          @input="setBooleanField('shareProcessNamespace', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('hostIPC')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.hostIPC')"
          @input="setBooleanField('hostIPC', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('automountServiceAccountToken')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.automountServiceAccountToken')"
          @input="setBooleanField('automountServiceAccountToken', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('serviceAccountName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'serviceAccountName')"
          :label="t('verrazzano.common.fields.podSpec.serviceAccountName')"
          @input="setFieldIfNotEmpty('serviceAccountName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('healthPort')"
          :mode="mode"
          type="Number"
          :min="minPortNumber"
          :max="maxPortNumber"
          :placeholder="getNotSetPlaceholder(value, 'healthPort')"
          :label="t('verrazzano.coherence.fields.healthPort')"
          @input="setNumberField('healthPort', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('runtimeClassName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'runtimeClassName')"
          :label="t('verrazzano.coherence.fields.runtimeClassName')"
          @input="setFieldIfNotEmpty('runtimeClassName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('priorityClassName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'priorityClassName')"
          :label="t('verrazzano.coherence.fields.priorityClassName')"
          @input="setFieldIfNotEmpty('priorityClassName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('schedulerName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'schedulerName')"
          :label="t('verrazzano.coherence.fields.schedulerName')"
          @input="setFieldIfNotEmpty('schedulerName', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-3">
        <LabeledInput
          :value="getField('activeDeadlineSeconds')"
          :mode="mode"
          type="Number"
          :min="0"
          :placeholder="getNotSetPlaceholder(value, 'activeDeadlineSeconds')"
          :label="t('verrazzano.coherence.fields.activeDeadlineSeconds')"
          @input="setNumberField('activeDeadlineSeconds', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('operatorRequestTimeout')"
          :mode="mode"
          type="Number"
          :min="0"
          :placeholder="getNotSetPlaceholder(value, 'operatorRequestTimeout')"
          :label="t('verrazzano.coherence.fields.operatorRequestTimeout')"
          @input="setNumberField('operatorRequestTimeout', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('preemptionPolicy')"
          :mode="mode"
          :options="preemptionPolicyOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'preemptionPolicy')"
          :label="t('verrazzano.coherence.fields.preemptionPolicy')"
          @input="setFieldIfNotEmpty('preemptionPolicy', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('restartPolicy')"
          :mode="mode"
          :options="restartPolicyOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'restartPolicy')"
          :label="t('verrazzano.coherence.fields.restartPolicy')"
          @input="setFieldIfNotEmpty('restartPolicy', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
