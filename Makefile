CDK = cd infra && npx cdk
CDK_DEPLOY = $(CDK) deploy --app cdk.out --require-approval never

.PHONY: clean generate synth build deploy

clean:
	rm -rf infra/cdk.out
	rm -rf .output

# Generates the static site using the env file for the given ENV.
# Usage: make generate ENV=qa   or   make generate ENV=prod
generate:
ifndef ENV
	$(error ENV is required. Usage: make generate ENV=qa)
endif
	npm run generate:$(ENV)

# Synthesises the CDK app after generating the site.
synth: generate
	$(CDK) synth

# Full build (generate + synth).
build: synth

# Deploy to AWS. Usage: make deploy ENV=qa  or  make deploy ENV=prod
deploy: build
	$(CDK_DEPLOY) '*-$(ENV)'
