use mes_rear_end;
show tables;

-- 用户表
drop table if exists sys_user;
create table sys_user(
    id                      bigint not null primary key auto_increment comment '用户ID',
    dept                    varchar(20) default null comment '部门',
    username                varchar(30) default '' unique comment '用户名称',
    password                varchar(255) default '' comment '密码',
    salt                    varchar(20) default '' comment '盐加密',
    user_type               varchar(2) default '00' comment '用户类型（00系统用户 01注册用户）',
    email                   varchar(50) default '' unique comment '邮箱',
    phone                   varchar(11) default '' unique comment '手机号码',
    gender                  char(1) default '0' comment '用户性别（0男 1女 2未知）',
    status                  char(1) default '0' comment '帐号状态（0正常 1停用）',
    login_date              datetime comment '最后登录时间',
    password_update_date    datetime comment '密码最后更新时间',
    create_by               varchar(64) default null comment '创建者',
    create_time             datetime comment '创建时间',
    remark                  varchar(500) default null comment '备注',
    is_delete               char(1) default 0 comment '删除标志（0代表存在 1代表删除）'
) engine = innodb comment = '用户信息表';
select * from sys_user;
select id, dept, username, user_type, email, phone, gender, status, login_date, password_update_date, create_by, create_time, remark from sys_user where is_delete = 0;
insert into sys_user values(0, '市场部', 'admin', '123456', 'longyuhuan.com', '00', '2630819701@qq.com', '17374000851', '0', '0', now(), now(), 'admin', now(), '管理员', 0);
insert into sys_user values(0, '开发部', 'zhangsan', '123456', 'longyuhuan.com', '00', 'zhangsan@qq.com', '13200000000', '0', '0', now(), now(), 'admin', now(), '测试员', 0);

-- 角色表
drop table if exists sys_role;
create table sys_role(
    id              bigint not null primary key auto_increment comment '角色ID',
    role_name       varchar(30) not null unique comment '角色名称',
    sort            int(4) not null comment '显示顺序',
    status          char(1) not null comment '角色状态（0正常 1停用）',
    create_by       varchar(64) default '' comment '创建者',
    create_time     datetime comment '创建时间',
    remark          varchar(500) default null comment '备注',
    is_delete     char(1) default '0' comment '删除标志（0代表存在 2代表删除）'
) engine = innodb comment = '角色信息表';
select * from sys_role;
insert into sys_role values(0, '超级管理员', 1, '0', 'admin', now(), '超级管理员', 0);
insert into sys_role values(0, '普通角色', 2, '0', 'admin', now(), '普通角色', 0);

-- 菜单表
drop table if exists sys_menu;
create table sys_menu(
    id          bigint not null primary key auto_increment comment '菜单ID',
    menu_name   varchar(50) not null unique comment '菜单名称',
    parent_id   bigint default 0 comment '父菜单ID',
    sort        int(4) default 0 comment '显示顺序',
    url         varchar(200) default '' comment '请求地址',
    menu_type   char(1) default '' comment '菜单类型（M目录 C菜单 F按钮）',
    visible     char(1) default 0 comment '菜单状态（0显示 1隐藏）',
    icon        varchar(100) default 'menu' comment '菜单图标'
) engine = innodb comment = '菜单权限表';
select * from sys_menu;
insert into sys_menu values(0, '系统管理', 0, 1, '/system', 'M', '0', 'setting');
insert into sys_menu values(0, '用户管理', 1, 2, '/system/users', 'C', '1', 'user');

-- 用户和角色关系表
drop table if exists sys_user_role;
create table sys_user_role(
    user_id      bigint not null comment '用户ID',
    foreign key(user_id) references sys_user(id),
    role_id      bigint not null comment '角色ID',
    foreign key(role_id) references sys_role(id),
    primary key (user_id, role_id)
) engine = innodb comment = '用户和角色关联表';
select * from sys_user_role;
insert into sys_user_role values(1, 1);
insert into sys_user_role values(2, 2);


-- 角色和菜单关系表
drop table if exists sys_role_menu;
create table sys_role_menu(
    role_id      bigint not null comment '角色ID',
    foreign key(role_id) references sys_role(id),
    menu_id      bigint not null comment '菜单ID',
    foreign key(role_id) references sys_menu(id),
    primary key (role_id, menu_id)
) engine = innodb comment = '角色和菜单关联表';
select * from sys_role_menu;
insert into sys_role_menu values(1, 1);
insert into sys_role_menu values(1, 2);
