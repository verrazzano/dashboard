<script>
// Added by Verrazzano
import WeblogicWorkloadHelper from '@pkg/mixins/weblogic-workload-helper';
import VerrazzanoWeblogic8Workload from './VerrazzanoWeblogic8Workload';
import VerrazzanoWeblogic9Workload from './VerrazzanoWeblogic9Workload';

export default {
  name:       'VerrazzanoWebLogicWorkload',
  components: { VerrazzanoWeblogic8Workload, VerrazzanoWeblogic9Workload },
  mixins:     [WeblogicWorkloadHelper],
  props:      {
    value: {
      type:     Object,
      required: true
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  data() {
    return {
      configRoot: this.value,
      namespace:  '',
    };
  },
  computed: {
    isModelInImage() {
      return this.getWorkloadSpecField('domainHomeSourceType') === 'FromModel';
    },
    isV8Domain() {
      const apiVersion = this.getWorkloadSpecField('apiVersion');

      return !apiVersion || apiVersion === this.verrazzanoWeblogicDomain8ApiVersion;
    },
    isV9Domain() {
      return this.getWorkloadSpecField('apiVersion') === this.verrazzanoWeblogicDomainApiVersion;
    },
  },
  methods:  {
    initSpec() {
      this.$set(this.configRoot, 'spec', {
        workload: {
          apiVersion: this.verrazzanoComponentApiVersion,
          kind:       'VerrazzanoWebLogicWorkload',
          spec:       {
            template: {
              metadata: { },
              spec:     { apiVersion: this.verrazzanoWeblogicDomainApiVersion }
            }
          }
        }
      });
    },
  },
  created() {
    if (!this.configRoot.spec?.workload?.spec?.template) {
      this.initSpec();
    }
  },
};
</script>

<template>
  <div>
    <VerrazzanoWeblogic8Workload v-if="isV8Domain" :value="value" :mode="mode" :is-model-in-image="isModelInImage" />
    <VerrazzanoWeblogic9Workload v-else :value="value" :mode="mode" :is-model-in-image="isModelInImage" />
  </div>
</template>

<style scoped>
</style>
