<template>
  <nav class="navbar navbar-expand-md bg-primary navbar-light">
    <div class="container-xxl">
      <a href="./" class="navbar-brand">
        <span class="fw-bold">
          DM Tools for AD&amp;D 2E
        </span>
      </a>

      <!-- toggle button for small screen -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#main-nav"
        aria-controls="main-nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- navbar items -->
      <div class="collapse navbar-collapse justify-content-end align-center" id="main-nav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/treasure-generator" custom v-slot="{ navigate, href, route }">
              <a class="nav-link" :href="href" @click="navigate">{{ route.name }}</a>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reaction" custom v-slot="{ navigate, href, route }">
              <a class="nav-link" :href="href" @click="navigate">{{ route.name }}</a>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style></style>
