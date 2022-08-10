<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Labels from '@/components/form/Labels';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';

export default {
  name:       'ServiceSpecTab',
  components: {
    Checkbox,
    LabeledArrayList,
    LabeledInput,
    LabeledSelect,
    Labels,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    let { clusterIPs } = this.value;

    if (typeof clusterIPs === 'undefined') {
      clusterIPs = [];
    }

    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
      isLoading:    true,
      clusterIPs,
    };
  },
  computed: {
    isExternalNameType() {
      const result = this.getField('type');

      return result === 'ExternalName';
    },
    isNotExternalNameType() {
      return !this.isExternalNameType;
    },
    isLoadBalancerType() {
      const result = this.getField('type');

      return result === 'LoadBalancer';
    },
    isSingleStack() {
      const result = this.getField('ipFamilyPolicy');

      return typeof result === 'undefined' || result === 'SingleStack';
    },
    ipFamiliesOptions() {
      return this.isSingleStack ? this.serviceIPFamiliesSingleStackOptions : this.serviceIPFamiliesDualStackOptions;
    },
    ipFamilies() {
      const currentValue = this.getField('ipFamilies');
      let result;

      if (Array.isArray(currentValue) && currentValue.length > 0) {
        const tmp = this.ipFamiliesOptions.find(entry => entry.value === currentValue);

        if (tmp) {
          result = tmp.label;
        }
      }

      return result;
    },
    showHealthCheckNodePort() {
      return this.isLoadBalancerType && this.getField('externalTrafficPolicy') === 'Local';
    }
  },
  methods: {
    setClusterIPsField(value) {
      if (Array.isArray(value) && value.length > 0) {
        this.clusterIPs = [value[0]];

        if (!this.isSingleStack && value.length > 1) {
          this.clusterIPs.push(value[1]);
        }

        this.setField('clusterIPs', this.clusterIPs);
      } else {
        this.clusterIPs = [];
        this.setField('clusterIPs', undefined);
      }
    }
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.coherence.tabs.service');
    }
  },
  mounted() {
    this.isLoading = false;
  },
  watch: {
    'value.type'(neu, old) {
      if (!this.isLoading) {
        if (old === 'LoadBalancer' && neu !== 'LoadBalancer') {
          this.setBooleanField('allocateLoadBalancerNodePorts', undefined);
        }

        if (old === 'ExternalName' && neu !== 'ExternalName') {
          this.setField('externalName', undefined);
        }

        if (old !== 'ExternalName' && neu === 'ExternalName') {
          this.setField('ipFamilies', undefined);
          this.setField('ipFamilyPolicy', undefined);
        }
      }
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="treeTabLabel"
        :mode="mode"
        @click="$emit('delete', value)"
      />
    </template>
    <template #default>
      <div class="row">
        <div class="col span-4">
          <Checkbox
            :value="getField('enabled')"
            :mode="mode"
            :label="t('verrazzano.coherence.fields.serviceEnabled')"
            @input="setBooleanField('enabled', $event)"
          />
          <div class="spacer-tiny" />
          <Checkbox
            :value="getField('publishNotReadyAddresses')"
            :mode="mode"
            :label="t('verrazzano.coherence.fields.publishNotReadyAddresses')"
            @input="setBooleanField('publishNotReadyAddresses', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getField('name')"
            :mode="mode"
            :placeholder="getNotSetPlaceholder(value, 'name')"
            :label="t('verrazzano.coherence.fields.serviceName')"
            @input="setFieldIfNotEmpty('name', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            :value="getField('type')"
            :mode="mode"
            :options="serviceTypeOptions"
            option-key="value"
            option-label="label"
            :placeholder="getNotSetPlaceholder(value, 'type')"
            :label="t('verrazzano.coherence.fields.serviceType')"
            @input="setFieldIfNotEmpty('type', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getField('portName')"
            :mode="mode"
            :placeholder="getNotSetPlaceholder(value, 'portName')"
            :label="t('verrazzano.coherence.fields.servicePortName')"
            @input="setFieldIfNotEmpty('portName', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('port')"
            :mode="mode"
            type="Number"
            :min="minPortNumber"
            :max="maxPortNumber"
            :placeholder="getNotSetPlaceholder(value, 'port')"
            :label="t('verrazzano.coherence.fields.servicePort')"
            @input="setNumberField('port', $event)"
          />
        </div>
        <div v-if="showHealthCheckNodePort" class="col span-4">
          <LabeledInput
            :value="getField('healthCheckNodePort')"
            :mode="mode"
            type="Number"
            :min="minPortNumber"
            :max="maxPortNumber"
            :placeholder="getNotSetPlaceholder(value, 'healthCheckNodePort')"
            :label="t('verrazzano.common.fields.healthCheckNodePort')"
            @input="setFieldIfNotEmpty('healthCheckNodePort', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <LabeledSelect
            :value="getField('externalTrafficPolicy')"
            :mode="mode"
            :options="externalTrafficPolicyOptions"
            option-key="value"
            option-label="label"
            :placeholder="getNotSetPlaceholder(value, 'externalTrafficPolicy')"
            :label="t('verrazzano.common.fields.externalTrafficPolicy')"
            @input="setFieldIfNotEmpty('externalTrafficPolicy', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            :value="getField('sessionAffinity')"
            :mode="mode"
            :options="sessionAffinityOptions"
            option-key="value"
            option-label="label"
            :placeholder="getNotSetPlaceholder(value, 'sessionAffinity')"
            :label="t('verrazzano.common.fields.sessionAffinity')"
            @input="setFieldIfNotEmpty('sessionAffinity', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('sessionAffinityConfig.clientIP.timeoutSeconds')"
            :mode="mode"
            type="Number"
            min="1"
            max="86400"
            :placeholder="getNotSetPlaceholder(value, 'sessionAffinityConfig.clientIP.timeoutSeconds')"
            :label="t('verrazzano.common.fields.sessionAffinityConfig.clientIP.timeoutSeconds')"
            @input="setFieldIfNotEmpty('sessionAffinityConfig.clientIP.timeoutSeconds', $event)"
          />
        </div>
      </div>
    </template>
    <template #nestedTabs>
      <TreeTab :name="createTabName(treeTabName, 'labels')" :label="t('verrazzano.common.tabs.labelsAndAnnotations')">
        <template #default>
          <Labels
            :value="value"
            :mode="mode"
            @input="$emit('input', $event)"
          />
        </template>
      </TreeTab>
      <TreeTab
        v-if="isNotExternalNameType"
        :name="createTabName(treeTabName, 'ip')"
        :label="t('verrazzano.coherence.tabs.ipSettings')"
      >
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledSelect
                :value="getField('ipFamilyPolicy')"
                :mode="mode"
                :options="serviceIPFamilyPolicyOptions"
                option-key="value"
                option-label="label"
                :placeholder="getNotSetPlaceholder(value, 'ipFamilyPolicy')"
                :label="t('verrazzano.common.fields.ipFamilyPolicy')"
                @input="setFieldIfNotEmpty('ipFamilyPolicy', $event)"
              />
            </div>
            <div class="col span-4">
              <LabeledSelect
                :value="ipFamilies"
                :mode="mode"
                :options="ipFamiliesOptions"
                option-key="value"
                option-label="label"
                :placeholder="getNotSetPlaceholder(value, 'ipFamilies')"
                :label="t('verrazzano.common.fields.ipFamilies')"
                @input="setFieldIfNotEmpty('ipFamilies', $event)"
              />
            </div>
            <div class="col span-4">
              <LabeledInput
                :value="getField('clusterIP')"
                :mode="mode"
                :placeholder="getNotSetPlaceholder(value, 'clusterIP')"
                :label="t('verrazzano.common.fields.clusterIP')"
                @input="setField('clusterIP', $event)"
              />
            </div>
          </div>
          <div class="spacer" />
          <h3>{{ t('verrazzano.coherence.titles.clusterIPs') }}</h3>
          <div class="row">
            <div class="col span-4">
              <LabeledArrayList
                :value="getListField('clusterIPs')"
                :mode="mode"
                :value-label="t('verrazzano.common.fields.clusterIPs')"
                :add-label="t('verrazzano.common.buttons.addClusterIP')"
                @input="setClusterIPsField($event)"
              />
            </div>
          </div>
        </template>
      </TreeTab>
      <TreeTab
        v-if="isLoadBalancerType"
        :name="createTabName(treeTabName, 'loadBalancer')"
        :label="t('verrazzano.coherence.tabs.loadBalancer')"
      >
        <template #default>
          <div class="row">
            <div class="col-span-4">
              <div class="spacer-tiny" />
              <Checkbox
                :value="getField('allocateLoadBalancerNodePorts')"
                :mode="mode"
                :label="t('verrazzano.coherence.fields.allocateLoadBalancerNodePorts')"
                @input="setBooleanField('allocateLoadBalancerNodePorts', $event)"
              />
            </div>
            <div class="col span-4">
              <LabeledInput
                :value="getField('loadBalancerIP')"
                :mode="mode"
                :placeholder="getNotSetPlaceholder(value, 'loadBalancerIP')"
                :label="t('verrazzano.common.fields.loadBalancerIP')"
                @input="setNumberField('loadBalancerIP', $event)"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <LabeledArrayList
                :value="getListField('loadBalancerSourceRanges')"
                :mode="mode"
                :value-label="t('verrazzano.common.fields.loadBalancerSourceRange')"
                :add-label="t('verrazzano.common.buttons.addLoadBalancerSourceRange')"
                @input="setFieldIfNotEmpty('loadBalancerSourceRanges', $event)"
              />
            </div>
          </div>
        </template>
      </TreeTab>
      <TreeTab
        v-else-if="isExternalNameType"
        :name="createTabName(treeTabName, 'external')"
        :label="t('verrazzano.coherence.tabs.externalName')"
      >
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledInput
                :value="getField('externalName')"
                :mode="mode"
                :placeholder="getNotSetPlaceholder(value, 'externalName')"
                :label="t('verrazzano.common.fields.externalName')"
                @input="setFieldIfNotEmpty('externalName', $event)"
              />
            </div>
            <div class="col span-4">
              <LabeledArrayList
                :value="getListField('externalIPs')"
                :mode="mode"
                :value-label="t('verrazzano.common.fields.externalIP')"
                :add-label="t('verrazzano.common.buttons.addExternalIP')"
                @input="setFieldIfNotEmpty('externalIPs', $event)"
              />
            </div>
          </div>
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>
  @import "../../verrazzano-styles.css";
</style>
