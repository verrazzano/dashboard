<script>
// Added by Verrazzano
import ConfigMap from '@/components/verrazzano/Volumes/ConfigMap';
import DownwardAPI from '@/components/verrazzano/Volumes/DownwardAPI';
import Secret from '@/components/verrazzano/Volumes/Secret';
import ServiceAccountToken from '@/components/verrazzano/Volumes/ProjectedVolume/ServiceAccountToken';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ProjectionSource',
  components: {
    ConfigMap,
    DownwardAPI,
    LabeledSelect,
    Secret,
    ServiceAccountToken,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
  data() {
    let projectionType = '';
    const sourceKeys = Object.keys(this.value).filter(key => key !== '_id');

    if (Array.isArray(sourceKeys) && sourceKeys.length > 0) {
      projectionType = sourceKeys[0];
    }

    return { projectionType };
  },
  computed: {
    projectionTypes() {
      return [
        { value: 'configMap', label: this.t('verrazzano.config.values.types.volumes.projected.configMap') },
        { value: 'downwardAPI', label: this.t('verrazzano.config.values.types.volumes.projected.downwardApi') },
        { value: 'secret', label: this.t('verrazzano.config.values.types.volumes.projected.secret') },
        { value: 'serviceAccountToken', label: this.t('verrazzano.config.values.types.volumes.projected.serviceAccountToken') },
      ];
    },
    showConfigMap() {
      return this.projectionType === 'configMap';
    },
    showDownwardAPI() {
      return this.projectionType === 'downwardAPI';
    },
    showSecret() {
      return this.projectionType === 'secret';
    },
    showServiceAccountToken() {
      return this.projectionType === 'serviceAccountToken';
    },
  },
  methods: {
    setProjectionType(value) {
      this.projectionType = value;
    },
  },
  watch: {
    projectionType(neu, old) {
      if (old) {
        this.setFieldIfNotEmpty(old, {});
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          v-model="projectionType"
          :mode="mode"
          required
          :options="projectionTypes"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.config.fields.volumes.projected.sourceType')"
          @input="setProjectionType($event)"
        />
      </div>
    </div>
    <div v-if="showConfigMap">
      <div class="spacer-small" />
      <h4>{{ t('verrazzano.config.titles.volumes.projected.configMap') }}</h4>
      <ConfigMap
        :value="getField('configMap')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :show-default-mode="false"
        @input="setFieldIfNotEmpty('configMap', $event)"
      />
    </div>
    <div v-else-if="showDownwardAPI">
      <div class="spacer-small" />
      <h4>{{ t('verrazzano.config.titles.volumes.projected.downwardApi') }}</h4>
      <DownwardAPI
        :value="getField('downwardAPI')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :show-default-mode="false"
        @input="setFieldIfNotEmpty('downwardAPI', $event)"
      />
    </div>
    <div v-else-if="showSecret">
      <div class="spacer-small" />
      <h4>{{ t('verrazzano.config.titles.volumes.projected.secret') }}</h4>
      <Secret
        :value="getField('secret')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :show-default-mode="false"
        @input="setFieldIfNotEmpty('secret', $event)"
      />
    </div>
    <div v-else-if="showServiceAccountToken">
      <div class="spacer-small" />
      <h4>{{ t('verrazzano.config.titles.volumes.projected.serviceAccountToken') }}</h4>
      <ServiceAccountToken
        :value="getField('serviceAccountToken')"
        :mode="mode"
        @input="setFieldIfNotEmpty('serviceAccountToken', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
