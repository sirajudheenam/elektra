Cronus::Engine.routes.draw do
  root to: "application#show", as: :root

  # root to: "catalog#show", as: :root

  scope "/cronus-api" do
    resources :entries, only: %i[index create update destroy]
  end

  scope "api" do
    resources :aws do
      member do
        get "account"
      end
    end
  end

  get "/*path", to: "application#show", via: :all
end
