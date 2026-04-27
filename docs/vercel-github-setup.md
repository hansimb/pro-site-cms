# Vercel + GitHub content setup

Use this setup for production. Without the `GITHUB_*` variables, admin saves only write to the temporary Vercel filesystem and will not persist.

## 1. Create a GitHub token

1. Open GitHub.
2. Go to `Settings` -> `Developer settings` -> `Personal access tokens` -> `Fine-grained tokens`.
3. Click `Generate new token`.
4. Give the token a name such as `pro-site-cms-vercel`.
5. Set the repository access to `Only select repositories`.
6. Select the `pro-site-cms` repository.
7. Under repository permissions, set `Contents` to `Read and write`.
8. Create the token.
9. Copy the token immediately. GitHub will only show it once.

## 2. Add the environment variables in Vercel

1. Open Vercel.
2. Open the `pro-site-cms` project.
3. Go to `Settings` -> `Environment Variables`.
4. Add these variables exactly:

```env
ADMIN_PASSWORD=your-admin-password
GITHUB_TOKEN=your-github-token
GITHUB_OWNER=hansimb
GITHUB_REPO=pro-site-cms
GITHUB_BRANCH=main
```

Use your actual GitHub username for `GITHUB_OWNER` if it is different.
Use your actual default branch name for `GITHUB_BRANCH` if it is not `main`.

## 3. Redeploy the project

After saving the environment variables, trigger a new deployment.

Use either of these:
- Redeploy the latest deployment in Vercel.
- Push any small commit to GitHub.

## 4. Verify that GitHub-backed saving works

1. Open the deployed site.
2. Log in to the admin.
3. Change any small piece of content, for example a line on the home page.
4. Save the change.
5. Open the GitHub repository.
6. Confirm that one of these paths changed:

- `content/...`
- `public/uploads/...`

7. Confirm that Vercel started a new deployment after the content commit.

## Expected behavior after setup

After this is configured:
- Saving content in the admin creates or updates files in the GitHub repository.
- GitHub receives a content commit.
- Vercel detects that commit and deploys the updated site.

## If saving does not persist

Check these first:
- `GITHUB_TOKEN` is present in Vercel.
- The token has `Contents: Read and write` permission.
- `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH` match the real repository.
- The project was redeployed after adding the variables.
