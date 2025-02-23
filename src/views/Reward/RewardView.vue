<template>
  <div class="h-auto bg-slate-50 flex flex-col lg:grid grid-cols-4">
    <loading
      :active="isLoadingStatus"
      :can-cancel="false"
      :is-full-page="true"
      color="#15C5B5"
      loader="dots"
      :height="60"
      :width="70"
      :lock-scroll="true"
    ></loading>
    <section
      v-if="editMode === false"
      :class="[`  px-5`, rewardSelected ? `col-span-3` : `col-span-4`]"
    >
      <!-- MENU -->
      <section class="flex flex-col lg:flex-row md:justify-between">
        <div class="text-3xl font-bold py-8">Reward</div>

        <div class="flex flex-col items-start md:flex-row md:items-center">
          <div v-if="pointFilter || searchFilter">
            <button
              class="flex bg-white border border-slate-200 md:mx-1 p-2 drop-shadow rounded"
              @click="clear()"
            >
              Clear <XIcon class="text-red-400" />
            </button>
          </div>
          <SearchBar
            @searchInput="receiveInputValue"
            :value="searchFilter"
            class="my-2 md:mx-1"
            :key="searchKey"
          />

          <DropDown
            class="my-2 md:mx-1"
            value="Select Sort Reward"
            :option="[`High to Low`, `Low to High`]"
            @dropDownValue="receiveDropdownValue"
            :key="dropdownKey"
          />

          <button
            @click="$router.push(`/reward/create`)"
            class="flex pr-4 pl-1 my-2 rounded items-center bg-primary cursor-pointer text-white text-sm p-2 drop-shadow-sm"
          >
            <PlusIcon class="text-slate-100 opacity-70 mx-1" />
            Add Reward
          </button>
        </div>
      </section>
      <!-- CONTENT -->
      <section class="h-4/5">
        <header
          class="w-full h-14 border border-slate-200 bg-white flex items-center px-3"
        >
          <span class="font-bold">All Reward</span>
          <span class="text-slate-400 ml-1">{{ rewardList.length }}</span>
        </header>
        <table class="table-auto w-full">
          <thead
            class="h-10 bg-slate-50 border border-slate-200 px-3 font-semibold text-slate-500 uppercase text-xs"
          >
            <tr>
              <th>No.</th>
              <th></th>
              <th>Name</th>
              <th>Point</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="h-14 border bg-white border-slate-200 hover:bg-slate-100 px-3 text-sm cursor-pointer text-center text-slate-500"
              v-for="(reward, index) in renderList"
              :key="reward._id"
              @click="selectReward(reward)"
            >
              <td>
                {{ maxRow * currentPage - maxRow + (index + 1) }}
              </td>
              <td class="">
                <div class="flex items-center justify-center">
                  <div class="ml-5">
                    <img
                      class="flex-shrink-0 w-10 h-10 rounded-full"
                      :src="reward.img"
                      alt=""
                    />
                  </div>
                </div>
              </td>
              <td class="font-medium w-1/2">
                <div class="flex items-center justify-center text-black">
                  <div class="ml-5">
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ reward.name }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="font-medium">{{ reward.point }}</td>
              <td class="font-medium">
                {{ reward.totalItem }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <!-- PAGINATION -->
      <section class="my-5 flex justify-between">
        <p class="text-slate-500">
          Showing event {{ maxRow * currentPage - maxRow + 1 }} to
          {{
            maxRow * currentPage < rewardFilter.length
              ? maxRow * currentPage
              : rewardFilter.length
          }}
          of
          {{ rewardFilter.length }}
          results
        </p>
        <div class="flex">
          <button
            @click="previousList"
            :class="[
              `border bg-white border-slate-200 hover:bg-slate-100 flex p-2`,
              currentPage === 1 ? `text-slate-300` : `text-green-500`,
            ]"
          >
            <ArrowLeftIcon class="p-1" />Previous
          </button>
          <button
            @click="nextList"
            :class="[
              `border bg-white border-slate-200 hover:bg-slate-100 flex p-2 ml-2`,
              currentPage === maxPage ? `text-slate-300` : `text-green-500`,
            ]"
          >
            Next <ArrowRightIcon class="p-1" />
          </button>
        </div>
      </section>
    </section>

    <RewardDetail
      v-if="rewardSelected && editMode === false"
      :rewardSelected="rewardSelected"
      @closeWindowDetail="receiveCloseDetail"
      class="w-full md:w-4/6 lg:w-full mx-auto lg:mx-0 border border-slate-200 px-4 col-auto"
    />

    <EventEdit
      v-if="editMode && rewardSelected"
      class="w-full h-full border border-slate-200 px-4 col-span-4 bg-slate-50"
    />
  </div>
</template>
<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import SearchBar from "../../components/SearchBar.vue";
import DropDown from "../../components/DropDown.vue";
import EventEdit from "../Event/EventEdit.vue";
import RewardDetail from "../Reward/RewardDetail.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
} from "@vue-hero-icons/outline";
export default {
  name: "EventView",
  components: {
    SearchBar,
    DropDown,
    PlusIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    XIcon,
    EventEdit,
    RewardDetail,
    Loading,
  },
  data() {
    return {
      isLoading: false,
      searchFilter: "",
      currentPage: 1,
      maxRow: 10,
      pointFilter: "",
      countKey: 0,
      searchKey: "s" + 0,
      dropdownKey: "d" + 0,
      rewardSelected: "",
    };
  },
  computed: {
    ...mapGetters({
      rewardList: "reward/getRewardList",
      editMode: "reward/getEditMode",
    }),
    renderList() {
      const startIndex =
        this.currentPage === 1
          ? 0
          : this.maxRow * this.currentPage - this.maxRow;
      const lastIndex = this.maxRow + startIndex;
      const renderRewardList = this.rewardFilter.slice(startIndex, lastIndex);
      return renderRewardList;
    },
    rewardFilter() {
      var rewardList = this.rewardList.filter((reward) => {
        return reward.name
          .toLowerCase()
          .includes(this.searchFilter.toLowerCase());
      });
      if (this.pointFilter) {
        rewardList =
          this.pointFilter === `High to Low`
            ? rewardList.sort((a, b) => b.point - a.point)
            : rewardList.sort((a, b) => a.point - b.point);
      }
      return rewardList;
    },
    maxPage() {
      return Math.ceil(this.rewardFilter.length / this.maxRow);
    },
    isLoadingStatus() {
      return this.isLoading;
    },
  },
  async mounted() {
    await this.fetchRewardList();
  },
  methods: {
    async fetchRewardList() {
      this.isLoading = true;
      await this.$store.dispatch("reward/fetchRewardList");
      this.isLoading = false;
    },
    receiveInputValue(searchFilter) {
      this.searchFilter = searchFilter;
    },
    nextList() {
      this.currentPage < this.maxPage ? this.currentPage++ : "";
    },
    previousList() {
      this.currentPage > 1 ? this.currentPage-- : "";
    },
    receiveDropdownValue(value) {
      this.pointFilter = value;
      this.currentPage = 1;
    },

    clear() {
      this.pointFilter = "";
      this.searchFilter = "";
      this.forceRerenderSearch();
    },
    forceRerenderSearch() {
      this.countKey++;
      this.dropdownKey = this.dropdownKey + this.countKey;
      this.searchKey = this.searchKey + this.countKey;
    },
    selectReward(event) {
      this.rewardSelected = event;
    },
    receiveCloseDetail(action) {
      if (!action) {
        this.rewardSelected = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
