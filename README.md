Create cluster on DO

helm install kafka bitnami/kafka
k apply -f ./apps.yaml
k apply -f ./ingress.yaml

Install Nginx Ingress on DO K8s cluster
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/do/deploy.yaml