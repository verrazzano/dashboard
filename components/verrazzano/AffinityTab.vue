<script>
import LabeledSelect from '@/components/form/LabeledSelect';
import NodeSelectorTerm from '@/components/verrazzano/NodeSelectorTerm';
import PodAffinityTerm from '@/components/verrazzano/PodAffinityTerm';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'AffinityTab',
  components: {
    LabeledSelect,
    NodeSelectorTerm,
    PodAffinityTerm,
    TabDeleteButton,
    TreeTab,
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
    tabName: {
      type:     String,
      default:  '',
      required: true
    },
    tabLabel: {
      type:     String,
      default:  '',
    },
  },
  data() {
    let preferredDuringSchedulingIgnoredDuringExecution = this.value.nodeAffinity?.preferredDuringSchedulingIgnoredDuringExecution || [];
    let requiredDuringSchedulingIgnoredDuringExecution = this.value.nodeAffinity?.requiredDuringSchedulingIgnoredDuringExecution || {};
    let nodeSelectorTerms = requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms || [];
    const allNodeSelectorTerms = [...preferredDuringSchedulingIgnoredDuringExecution, ...nodeSelectorTerms].map((term) => {
      const neu = this.clone(term);

      neu._id = randomStr(4);

      return neu;
    });

    preferredDuringSchedulingIgnoredDuringExecution = this.value.podAffinity?.preferredDuringSchedulingIgnoredDuringExecution || [];
    requiredDuringSchedulingIgnoredDuringExecution = this.value.podAffinity?.requiredDuringSchedulingIgnoredDuringExecution || {};
    nodeSelectorTerms = requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms || [];
    const allPodSelectorTerms = [...preferredDuringSchedulingIgnoredDuringExecution, ...nodeSelectorTerms].map((term) => {
      const neu = this.clone(term);

      neu._id = randomStr(4);

      return neu;
    });

    preferredDuringSchedulingIgnoredDuringExecution = this.value.podAntiAffinity?.preferredDuringSchedulingIgnoredDuringExecution || [];
    requiredDuringSchedulingIgnoredDuringExecution = this.value.podAntiAffinity?.requiredDuringSchedulingIgnoredDuringExecution || {};
    nodeSelectorTerms = requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms || [];
    const allPodAntiSelectorTerms = [...preferredDuringSchedulingIgnoredDuringExecution, ...nodeSelectorTerms].map((term) => {
      const neu = this.clone(term);

      neu._id = randomStr(4);

      return neu;
    });

    return {
      treeTabName:         this.tabName,
      treeTabLabel:        this.tabLabel,
      newAffinityType:     '',
      newSelectorTermType: '',
      allNodeSelectorTerms,
      allPodSelectorTerms,
      allPodAntiSelectorTerms,
    };
  },
  computed: {
    affinityTypeOptions() {
      return [
        { value: 'nodeAffinity', label: this.t('verrazzano.common.types.affinityType.nodeAffinity') },
        { value: 'podAffinity', label: this.t('verrazzano.common.types.affinityType.podAffinity') },
        { value: 'podAntiAffinity', label: this.t('verrazzano.common.types.affinityType.podAntiAffinity') },
      ];
    },
    selectorTermTypeOptions() {
      return [
        { value: 'preferred', label: this.t('verrazzano.common.types.selectorTermType.preferred') },
        { value: 'required', label: this.t('verrazzano.common.types.selectorTermType.required') },
      ];
    },
    showNodeAffinityTab() {
      return this.allNodeSelectorTerms.length > 0;
    },
    showPodAffinityTab() {
      return this.allPodSelectorTerms.length > 0;
    },
    showPodAntiAffinityTab() {
      return this.allPodAntiSelectorTerms.length > 0;
    },
  },
  methods: {
    _updateHelper(allTerms, required, preferred) {
      allTerms.forEach((term) => {
        if (term.weight) {
          const neuTerm = { ...term };
          const weight = Number(neuTerm.weight);

          delete neuTerm.weight;
          delete neuTerm._id;

          const neu = { weight, preference: neuTerm };

          preferred.push(neu);
        } else {
          const neu = { ...term };

          delete neu._id;
          required.nodeSelectorTerms.push(neu);
        }
      });
    },
    update() {
      const nodePreferred = [];
      const nodeRequired = { nodeSelectorTerms: [] };
      const podPreferred = [];
      const podRequired = { nodeSelectorTerms: [] };
      const antiPodPreferred = [];
      const antiPodRequired = { nodeSelectorTerms: [] };

      this._updateHelper(this.allNodeSelectorTerms, nodeRequired, nodePreferred);
      this._updateHelper(this.allPodSelectorTerms, podRequired, podPreferred);
      this._updateHelper(this.allPodAntiSelectorTerms, antiPodRequired, antiPodPreferred);

      this.setFieldIfNotEmpty('nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution', nodePreferred);
      this.setFieldIfNotEmpty('nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution', nodeRequired);
      this.setFieldIfNotEmpty('podAffinity.preferredDuringSchedulingIgnoredDuringExecution', podPreferred);
      this.setFieldIfNotEmpty('podAffinity.requiredDuringSchedulingIgnoredDuringExecution', podRequired);
      this.setFieldIfNotEmpty('podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution', antiPodPreferred);
      this.setFieldIfNotEmpty('podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution', antiPodRequired);
    },
    addAffinityTerm(list = null) {
      if (this.newAffinityType && this.newSelectorTermType) {
        let affinityList = list;

        if (!affinityList) {
          switch (this.newAffinityType) {
          case 'nodeAffinity':
            affinityList = this.allNodeSelectorTerms;
            break;

          case 'podAffinity':
            affinityList = this.allPodSelectorTerms;
            break;

          case 'podAntiAffinity':
            affinityList = this.allPodAntiSelectorTerms;
            break;
          }
        }
        const newSelectorTerm = { _id: randomStr(4) };

        if (this.newSelectorTermType === 'preferred') {
          newSelectorTerm.weight = 1;
        }

        affinityList.push(newSelectorTerm);
      }
    },
    getNodeSelectorTermTabName(index) {
      return this.createTabKey(this.createTabKey(this.treeTabName, 'nodeAffinity'), `term${ index + 1 }`);
    },
    getNodeSelectorTermTabLabel(index) {
      return this.t('verrazzano.common.tabs.nodeSelectorTerm', { index: index + 1 });
    },
    getPodSelectorTermTabName(index) {
      return this.createTabKey(this.createTabKey(this.treeTabName, 'podAffinity'), `term${ index + 1 }`);
    },
    getPodSelectorTermTabLabel(index) {
      return this.t('verrazzano.common.tabs.podSelectorTerm', { index: index + 1 });
    },
    getPodAntiSelectorTermTabName(index) {
      return this.createTabKey(this.createTabKey(this.treeTabName, 'podAntiAffinity'), `term${ index + 1 }`);
    },
    getPodAntiSelectorTermTabLabel(index) {
      return this.t('verrazzano.common.tabs.podAntiSelectorTerm', { index: index + 1 });
    },
    removeAffinitySelectorTerm(list, index) {
      list.splice(index, 1);
      this.queueUpdate();
    },
    removeAffinity() {
      this.allNodeSelectorTerms.length = 0;
      this.allPodSelectorTerms.length = 0;
      this.allPodAntiSelectorTerms.length = 0;
      this.queueUpdate();
    },
    removeNodeAffinity() {
      this.allNodeSelectorTerms.length = 0;
      this.queueUpdate();
    },
    removePodAffinity() {
      this.allPodSelectorTerms.length = 0;
      this.queueUpdate();
    },
    removePodAntiAffinity() {
      this.allPodAntiSelectorTerms.length = 0;
      this.queueUpdate();
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.affinity');
    }

    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="t('verrazzano.common.tabs.affinity')"
        :mode="mode"
        @click="removeAffinity()"
      />
    </template>
    <template #default>
      <div class="row">
        <div class="col span-4">
          <LabeledSelect
            v-model="newAffinityType"
            :mode="mode"
            required
            :options="affinityTypeOptions"
            option-key="value"
            option-label="label"
            :label="t('verrazzano.common.fields.newAffinityType')"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            v-model="newSelectorTermType"
            :mode="mode"
            required
            :options="selectorTermTypeOptions"
            option-key="value"
            option-label="label"
            :label="t('verrazzano.common.fields.newAffinityType')"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <button
            type="button"
            :disabled="isView"
            class="btn role-tertiary add"
            @click="addAffinityTerm()"
          >
            {{ t('verrazzano.common.buttons.addAffinitySelectorTerm') }}
          </button>
        </div>
      </div>
    </template>
    <template #nestedTabs>
      <TreeTab v-if="showNodeAffinityTab" :name="createTabKey(treeTabName, 'nodeAffinity')" :label="t('verrazzano.common.tabs.nodeAffinity')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.nodeAffinity')"
            :mode="mode"
            @click="removeNodeAffinity()"
          />
        </template>
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledSelect
                v-model="newSelectorTermType"
                :mode="mode"
                required
                :options="selectorTermTypeOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.common.fields.newAffinityType')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <button
                type="button"
                :disabled="isView"
                class="btn role-link close btn-sm"
                @click="addAffinityTerm(allNodeSelectorTerms)"
              >
                {{ t('verrazzano.common.buttons.addNodeSelectorTerm') }}
              </button>
            </div>
          </div>
        </template>
        <template #nestedTabs>
          <TreeTab
            v-for="(term, idx) in allNodeSelectorTerms"
            :key="idx"
            :name="getNodeSelectorTermTabName(idx)"
            :label="getNodeSelectorTermTabLabel(idx)"
          >
            <NodeSelectorTerm
              :value="term"
              :mode="mode"
              @input="queueUpdate"
            />
          </TreeTab>
        </template>
      </TreeTab>
      <TreeTab v-if="showPodAffinityTab" :name="createTabKey(treeTabName, 'podAffinity')" :label="t('verrazzano.common.tabs.podAffinity')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.podAffinity')"
            :mode="mode"
            @click="removePodAffinity()"
          />
        </template>
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledSelect
                v-model="newSelectorTermType"
                :mode="mode"
                required
                :options="selectorTermTypeOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.common.fields.newAffinityType')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <button
                type="button"
                :disabled="isView"
                class="btn role-link close btn-sm"
                @click="addAffinityTerm(allPodSelectorTerms)"
              >
                {{ t('verrazzano.common.buttons.addPodSelectorTerm') }}
              </button>
            </div>
          </div>
        </template>
        <template #nestedTabs>
          <TreeTab
            v-for="(term, idx) in allPodSelectorTerms"
            :key="idx"
            :name="getPodSelectorTermTabName(idx)"
            :label="getPodSelectorTermTabLabel(idx)"
          >
            <PodAffinityTerm
              :value="term"
              :mode="mode"
              @input="queueUpdate"
            />
          </TreeTab>
        </template>
      </TreeTab>
      <TreeTab v-if="showPodAntiAffinityTab" :name="createTabKey(treeTabName, 'podAntiAffinity')" :label="t('verrazzano.common.tabs.podAntiAffinity')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.podAntiAffinity')"
            :mode="mode"
            @click="removePodAntiAffinity()"
          />
        </template>
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledSelect
                v-model="newSelectorTermType"
                :mode="mode"
                required
                :options="selectorTermTypeOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.common.fields.newAffinityType')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <button
                type="button"
                :disabled="isView"
                class="btn role-link close btn-sm"
                @click="addAffinityTerm(allPodSelectorTerms)"
              >
                {{ t('verrazzano.common.buttons.addPodSelectorTerm') }}
              </button>
            </div>
          </div>
        </template>
        <template #nestedTabs>
          <TreeTab
            v-for="(term, idx) in allPodAntiSelectorTerms"
            :key="idx"
            :name="getPodAntiSelectorTermTabName(idx)"
            :label="getPodAntiSelectorTermTabLabel(idx)"
          >
            <PodAffinityTerm
              :value="term"
              :mode="mode"
              @input="queueUpdate"
            />
          </TreeTab>
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
